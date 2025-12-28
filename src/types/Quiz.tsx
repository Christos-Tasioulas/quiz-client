import type {Run} from "./Run.tsx";
import type {Question} from "./Question.tsx";

export interface Quiz {
    id?: number;
    name: string;
    runs: Run[];
    questions: Question[];
    numberOfQuestions: number;
}

export interface QuizRequestWithQuestions {
    name: string;
    questions: Question[];
}

export interface QuizRequest {
    name: string;
}