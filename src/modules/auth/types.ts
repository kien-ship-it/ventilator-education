export interface User {
    id: string
    name: string
    email: string
    avatarId: string
    enrollmentDate: Date
    onboardingCompleted: boolean
    createdAt: Date
}

export interface Session {
    accessToken: string
    refreshToken: string
    user: User
}

export interface AuthService {
    register(name: string, email: string, password: string): Promise<User>
    login(email: string, password: string): Promise<Session>
    logout(): Promise<void>
    getCurrentUser(): Promise<User | null>
    updateAvatar(userId: string, avatarId: string): Promise<void>
    completeOnboarding(userId: string): Promise<void>
}
