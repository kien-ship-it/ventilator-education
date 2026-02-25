export interface IslandStatus {
    islandId: string
    name: string
    unlocked: boolean
    unlockDay: number
    completionPercentage: number
    finalExamUnlocked: boolean
}

export interface IslandProgress {
    totalActivities: number
    completedActivities: number
    completionPercentage: number
    finalExamUnlocked: boolean
}
