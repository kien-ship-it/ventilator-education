export interface AggregateMetrics {
    totalUsers: number
    averagePeepPoints: number
    averageStreak: number
    completionRatesByIsland: Record<string, number>
    averageTimeSpent: number
}

export interface UserMetrics {
    anonymizedId: string
    totalPeepPoints: number
    longestStreak: number
    totalTimeMinutes: number
    completionPercentageByIsland: Record<string, number>
}
