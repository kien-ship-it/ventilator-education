import { NextResponse } from 'next/server'
import { authService } from '@/modules/auth/service'

export async function POST() {
    try {
        await authService.logout()
        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Logout failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
