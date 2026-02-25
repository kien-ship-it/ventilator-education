export type ActivityType = 'video' | 'reading' | 'quiz' | 'case_vignette' | 'quest' | 'vent_lab'

export interface Activity {
    id: string
    islandId: string
    type: ActivityType
    title: string
    description: string
    estimatedMinutes: number
    peepPointsValue: number
    sortOrder: number
    content: VideoContent | ReadingContent | QuizContent | CaseContent | QuestContent | VentLabContent | null
}

export interface VideoContent {
    storageKey: string
    durationSeconds: number
}

export interface ReadingContent {
    body: string
    confirmationQuestion: {
        question: string
        correctAnswer: string
        options: string[]
    }
}

export interface QuizContent {
    questions: QuizQuestionContent[]
}

export interface QuizQuestionContent {
    id: string
    type: 'mcq' | 'drag_drop' | 'matching' | 'fill_blank'
    prompt: string
    options: string[]
    correctAnswer: string | string[]
    imageUrl?: string
}

export interface CaseContent {
    scenario: string
    decisions: { id: string; text: string; nextId?: string }[]
    sbarTemplate: { situation: string; background: string; assessment: string; recommendation: string }
}

export interface QuestContent {
    instructions: string
    validationPassword: string
    supervisorRole: string
}

export interface VentLabContent {
    initialSettings: Record<string, number>
    targetValues: Record<string, number>
}
