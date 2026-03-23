import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/modules/auth/service'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        const session = await authService.login(email, password)
        return NextResponse.json({ session }, { status: 200 })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed'
        return NextResponse.json({ error: message }, { status: 401 })
    }
}
