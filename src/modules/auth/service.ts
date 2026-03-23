import { createClient } from '@/lib/supabase/server'
import type { User, Session, AuthService } from './types'

function mapDbUserToUser(dbUser: Record<string, unknown>): User {
    return {
        id: dbUser.id as string,
        name: dbUser.name as string,
        email: dbUser.email as string,
        avatarId: dbUser.avatar_id as string,
        enrollmentDate: new Date(dbUser.enrollment_date as string),
        onboardingCompleted: dbUser.onboarding_completed as boolean,
        createdAt: new Date(dbUser.created_at as string),
    }
}

export const authService: AuthService = {
    async register(name: string, email: string, password: string): Promise<User> {
        const supabase = await createClient()

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (signUpError) throw new Error(signUpError.message)
        if (!authData.user) throw new Error('Registration failed: no user returned')

        const { data: dbUser, error: insertError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                name,
                email,
                avatar_id: 'astronaut',
                enrollment_date: new Date().toISOString().split('T')[0],
                onboarding_completed: false,
            })
            .select()
            .single()

        if (insertError) throw new Error(insertError.message)

        return mapDbUserToUser(dbUser)
    },

    async login(email: string, password: string): Promise<Session> {
        const supabase = await createClient()

        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) throw new Error(error.message)
        if (!data.session || !data.user) throw new Error('Login failed: no session returned')

        const { data: dbUser, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single()

        if (userError) throw new Error(userError.message)

        return {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            user: mapDbUserToUser(dbUser),
        }
    },

    async logout(): Promise<void> {
        const supabase = await createClient()
        const { error } = await supabase.auth.signOut()
        if (error) throw new Error(error.message)
    },

    async getCurrentUser(): Promise<User | null> {
        const supabase = await createClient()

        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) return null

        const { data: dbUser, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single()

        if (error) return null

        return mapDbUserToUser(dbUser)
    },

    async updateAvatar(userId: string, avatarId: string): Promise<void> {
        const supabase = await createClient()

        const { error } = await supabase
            .from('users')
            .update({ avatar_id: avatarId })
            .eq('id', userId)

        if (error) throw new Error(error.message)
    },

    async completeOnboarding(userId: string): Promise<void> {
        const supabase = await createClient()

        const { error } = await supabase
            .from('users')
            .update({ onboarding_completed: true })
            .eq('id', userId)

        if (error) throw new Error(error.message)
    },
}
