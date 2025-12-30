import { z } from "zod";

export const answerSchema = z.object({
    id: z.coerce.number().nullable().optional(),
    answer: z.string().min(1, "Answer is required"),
    score: z.record(z.string(), z.number()).optional(),
});

export const questionSchema = z.object({
    id: z.coerce.number().nullable().optional(),
    question: z.string().min(1, "Question is required"),
    answers: z
        .array(answerSchema)
        .min(2, "Each question must have at least 2 answers"),
});


export const quizSchema = z.object({
    id: z.coerce.number().nullable().optional(),
    name: z.string().min(1, "Quiz name is required"),
    questions: z
        .array(questionSchema)
        .min(1, "At least one question is required"),
});


export type QuizFormValues = z.infer<typeof quizSchema>;
