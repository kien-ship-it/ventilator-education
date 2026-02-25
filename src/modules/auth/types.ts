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
