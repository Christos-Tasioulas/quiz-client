import type {Run} from "./Run.tsx";
import type {Question, QuestionRequest} from "./Question.tsx";

export interface Quiz {
    id?: number;
    name: string;
    runs: Run[];
    questions: Question[];
    numberOfQuestions: number;
}

export interface QuizRequestWithQuestions {
    name: string;
    questions: QuestionRequest[];
}

export interface QuizRequest {
    name: string;
}