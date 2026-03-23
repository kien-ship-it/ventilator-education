export interface IslandStatus {
    islandId: string
    name: string
    unlocked: boolean
    unlockDay: number
    completionPercentage: number
    finalExamUnlocked: boolean
}

export interface IslandProgress {
    totalActivities: number
    completedActivities: number
    completionPercentage: number
    finalExamUnlocked: boolean
}

export interface ProgressionService {
    getUnlockedIslands(userId: string): Promise<IslandStatus[]>
    getIslandProgress(userId: string, islandId: string): Promise<IslandProgress>
    isFinalExamUnlocked(userId: string, islandId: string): Promise<boolean>
    canAccessContent(userId: string): Promise<boolean>
    markActivityComplete(userId: string, activityId: string): Promise<void>
}
