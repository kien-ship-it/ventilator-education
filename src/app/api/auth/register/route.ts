import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/modules/auth/service'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, password } = body

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            )
        }

        const user = await authService.register(name, email, password)
        return NextResponse.json({ user }, { status: 201 })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed'
        return NextResponse.json({ error: message }, { status: 400 })
    }
}
