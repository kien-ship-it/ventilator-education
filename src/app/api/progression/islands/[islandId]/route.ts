import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { progressionService } from '@/modules/progression/service'

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ islandId: string }> }
) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { islandId } = await params
        const progress = await progressionService.getIslandProgress(user.id, islandId)
        return NextResponse.json({ progress }, { status: 200 })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch island progress'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
