export type QuestionType = 'mcq' | 'drag_drop' | 'matching' | 'fill_blank'

export interface QuizQuestion {
    id: string
    type: QuestionType
    prompt: string
    options: string[]
    correctAnswer: string | string[]
    imageUrl?: string
}

export interface RandomizedQuiz {
    activityId: string
    questions: QuizQuestion[]
}

export interface QuizAnswer {
    questionId: string
    answer: string | string[]
}

export interface AnswerResult {
    correct: boolean
    correctAnswer: string | string[]
}

export interface QuizResult {
    score: number
    totalQuestions: number
    pointsEarned: number
}
