import { createClient } from '@/lib/supabase/server'
import type { IslandStatus, IslandProgress, ProgressionService } from './types'

export const DAILY_ACTIVITY_LIMIT = 10

// Island unlock windows based on enrollment day
const ISLAND_UNLOCK_SCHEDULE: { islandSortOrder: number; unlockDayStart: number }[] = [
    { islandSortOrder: 1, unlockDayStart: 0 },
    { islandSortOrder: 2, unlockDayStart: 0 },
    { islandSortOrder: 3, unlockDayStart: 31 },
    { islandSortOrder: 4, unlockDayStart: 31 },
    { islandSortOrder: 5, unlockDayStart: 61 },
    { islandSortOrder: 6, unlockDayStart: 61 },
]

function getDaysSinceEnrollment(enrollmentDate: Date): number {
    const now = new Date()
    const msPerDay = 1000 * 60 * 60 * 24
    return Math.floor((now.getTime() - enrollmentDate.getTime()) / msPerDay)
}

export const progressionService: ProgressionService = {
    async getUnlockedIslands(userId: string): Promise<IslandStatus[]> {
        const supabase = await createClient()

        // Get user enrollment date
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('enrollment_date')
            .eq('id', userId)
            .single()

        if (userError) throw new Error(userError.message)

        const enrollmentDay = getDaysSinceEnrollment(new Date(user.enrollment_date))

        // Get all islands
        const { data: islands, error: islandsError } = await supabase
            .from('islands')
            .select('id, name, sort_order, unlock_day_start, total_activities')
            .order('sort_order')

        if (islandsError) throw new Error(islandsError.message)

        // Get user progress counts per island
        const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('activity_id, activities(island_id)')
            .eq('user_id', userId)
            .eq('completed', true)

        if (progressError) throw new Error(progressError.message)

        // Count completed activities per island
        const completedByIsland: Record<string, number> = {}
        for (const row of progressData ?? []) {
            const activity = row.activities as unknown as { island_id: string } | null
            if (activity?.island_id) {
                completedByIsland[activity.island_id] = (completedByIsland[activity.island_id] ?? 0) + 1
            }
        }

        return islands.map((island) => {
            const unlocked = island.unlock_day_start <= enrollmentDay
            const completed = completedByIsland[island.id] ?? 0
            const total = island.total_activities ?? 0
            const completionPercentage = total > 0 ? Math.floor((completed / total) * 100) : 0
            const finalExamUnlocked = completionPercentage >= 80

            return {
                islandId: island.id,
                name: island.name,
                unlocked,
                unlockDay: island.unlock_day_start,
                completionPercentage,
                finalExamUnlocked,
            }
        })
    },

    async getIslandProgress(userId: string, islandId: string): Promise<IslandProgress> {
        const supabase = await createClient()

        // Get island total activities
        const { data: island, error: islandError } = await supabase
            .from('islands')
            .select('total_activities')
            .eq('id', islandId)
            .single()

        if (islandError) throw new Error(islandError.message)

        // Get completed activities for this island
        const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('activity_id, activities!inner(island_id)')
            .eq('user_id', userId)
            .eq('completed', true)
            .eq('activities.island_id', islandId)

        if (progressError) throw new Error(progressError.message)

        const totalActivities = island.total_activities ?? 0
        const completedActivities = progressData?.length ?? 0
        const completionPercentage = totalActivities > 0
            ? Math.floor((completedActivities / totalActivities) * 100)
            : 0
        const finalExamUnlocked = completionPercentage >= 80

        return {
            totalActivities,
            completedActivities,
            completionPercentage,
            finalExamUnlocked,
        }
    },

    async isFinalExamUnlocked(userId: string, islandId: string): Promise<boolean> {
        const progress = await this.getIslandProgress(userId, islandId)
        return progress.finalExamUnlocked
    },

    async canAccessContent(userId: string): Promise<boolean> {
        const supabase = await createClient()

        const today = new Date().toISOString().split('T')[0]

        const { data, error } = await supabase
            .from('user_daily_activity')
            .select('activities_completed')
            .eq('user_id', userId)
            .eq('activity_date', today)
            .single()

        if (error && error.code !== 'PGRST116') {
            // PGRST116 = no rows found, which means 0 activities today
            throw new Error(error.message)
        }

        const completedToday = data?.activities_completed ?? 0
        return completedToday < DAILY_ACTIVITY_LIMIT
    },

    async markActivityComplete(userId: string, activityId: string): Promise<void> {
        const supabase = await createClient()

        // Check binge prevention before marking complete
        const canAccess = await this.canAccessContent(userId)
        if (!canAccess) {
            throw new Error('Daily activity limit reached. Please return tomorrow.')
        }

        // Upsert user_progress record
        const { error: progressError } = await supabase
            .from('user_progress')
            .upsert(
                {
                    user_id: userId,
                    activity_id: activityId,
                    completed: true,
                    completed_at: new Date().toISOString(),
                },
                { onConflict: 'user_id,activity_id' }
            )

        if (progressError) throw new Error(progressError.message)

        // Update daily activity log
        const today = new Date().toISOString().split('T')[0]

        const { data: existing, error: fetchError } = await supabase
            .from('user_daily_activity')
            .select('id, activities_completed')
            .eq('user_id', userId)
            .eq('activity_date', today)
            .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw new Error(fetchError.message)
        }

        if (existing) {
            const { error: updateError } = await supabase
                .from('user_daily_activity')
                .update({ activities_completed: existing.activities_completed + 1 })
                .eq('id', existing.id)

            if (updateError) throw new Error(updateError.message)
        } else {
            const { error: insertError } = await supabase
                .from('user_daily_activity')
                .insert({
                    user_id: userId,
                    activity_date: today,
                    activities_completed: 1,
                    minutes_spent: 0,
                })

            if (insertError) throw new Error(insertError.message)
        }
    },
}
