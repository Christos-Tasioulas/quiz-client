
export type Score = object | null
// Should be adjusted according to the quiz's needs

export interface Answer {
    id?: number;
    answer: string;
    score: Score;
}

export interface AnswerRequest {
    answer: string;
    score?: Score;
}

export interface Question {
    id?: number;
    quizId?: number;
    question: string;
    answers: Answer[];
}

export interface QuestionRequest {
    question: string;
    answers: AnswerRequest[];
}

export interface QuestionFormData {
    question: string;
    answers: string[];
}