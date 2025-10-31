
type Score = object | null
// Should be adjusted according to the quiz's needs

export interface Answer {
    id?: number;
    answer: string;
    score: Score;
}

export interface Question {
    id?: number;
    question: string;
    answers: Answer[];
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