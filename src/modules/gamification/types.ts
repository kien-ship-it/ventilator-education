export interface PointsResult {
    awarded: boolean
    pointsAwarded: number
    totalPoints: number
}

export interface StreakInfo {
    currentStreak: number
    longestStreak: number
    lastActiveDate: Date
    streakBonusEarned: boolean
}
