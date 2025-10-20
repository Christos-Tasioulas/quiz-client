
export interface Answer {
    id?: number;
    answer: string;
}

export interface Question {
    id?: number;
    question: string;
    answers: Answer[];
}