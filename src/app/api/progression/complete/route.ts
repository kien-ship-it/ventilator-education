import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { progressionService } from '@/modules/progression/service'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { activityId } = body

        if (!activityId) {
            return NextResponse.json({ error: 'activityId is required' }, { status: 400 })
        }

        await progressionService.markActivityComplete(user.id, activityId)
        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to mark activity complete'
        const status = message.includes('Daily activity limit') ? 429 : 500
        return NextResponse.json({ error: message }, { status })
    }
}
