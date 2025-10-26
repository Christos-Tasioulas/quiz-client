
export interface Answer {
    id?: number;
    answer: string;
    score: object | null;
}

export interface Question {
    id?: number;
    question: string;
    answers: string[];
}

export interface QuestionRequest {
    id?: number;
    question: string;
    answers: Answer[];
}

export interface QuestionFormData {
    question: string;
    answers: string[];
}