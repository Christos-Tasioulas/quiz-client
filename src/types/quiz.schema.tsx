import { z } from "zod";

const idSchema = z
    .union([
        z.coerce.number(), // converts "123" → 123
        z.literal(""),     // allows empty string from form
        z.null(),
        z.undefined(),
    ])
    .transform(v => (v === "" ? null : v));

export const answerSchema = z.object({
    id: idSchema.optional(),
    answer: z.string().min(1, "Answer is required"),
    score: z.record(z.string(), z.number()).optional(),
});

export const questionSchema = z.object({
    id: idSchema.optional(),
    question: z.string().min(1, "Question is required"),
    answers: z.array(answerSchema).min(2),
});

export const quizSchema = z.object({
    id: idSchema.optional(),
    name: z.string().min(1),
    questions: z.array(questionSchema).min(1),
});

export type QuizFormValues = z.infer<typeof quizSchema>;
