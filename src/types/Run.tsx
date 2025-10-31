
export interface QuestionAnswered {
    id?: number;
    runId: number;
    questionId: number;
    questionText: string;
    answerId: number;
    answerText: string;
    questionAnswered: boolean;
}

export interface QuestionAnsweredRequest {
    runId: number;
    questionId: number;
    answerId?: number;
    questionAnswered?: boolean;
}

export interface Run {
    id?: number;
    userId: number;
    username: string;
    questions: QuestionAnswered[];
    totalQuestions: number;
    questionsAnswered: number;
    progress: number;
    startedAt: string;       // ISO string from backend
    finishedAt: string | null; // null until run is finished
}

export interface RunRequest {
    userId?: number;
    score: object;
    totalQuestions: number;
    questionsAnswered: number;
}