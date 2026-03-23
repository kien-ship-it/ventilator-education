import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { progressionService } from '@/modules/progression/service'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const islands = await progressionService.getUnlockedIslands(user.id)
        return NextResponse.json({ islands }, { status: 200 })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch islands'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
