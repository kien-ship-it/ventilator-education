/**
 * Calculate the enrollment day for a user based on their enrollment date.
 */
export function getEnrollmentDay(enrollmentDate: Date): number {
    const now = new Date()
    const diffMs = now.getTime() - enrollmentDate.getTime()
    return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Determine which islands should be unlocked based on enrollment day.
 */
export function getUnlockedIslandRange(enrollmentDay: number): number {
    if (enrollmentDay >= 61) return 6
    if (enrollmentDay >= 31) return 4
    return 2
}
