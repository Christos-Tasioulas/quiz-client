import { useEffect, useState } from "react";
import {useForm, useFieldArray, FormProvider, type SubmitHandler} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quizSchema, type QuizFormValues } from "../types/quiz.schema";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../services/user-api.tsx";
import { createQuizWithQuestions } from "../services/quiz-api.tsx";
import type { User } from "../types/BasicTypes.tsx";
import ErrorMessage from "../components/ErrorMessage.tsx";
import QuestionForm from "../components/QuestionForm.tsx";

export default function AddQuiz({ token }: { token: string }) {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User>();
    const isAdmin = currentUser?.role === "ADMIN";

    useEffect(() => {
        if (!token) return;
        fetchCurrentUser().then(setCurrentUser).catch(console.error);
    }, [token]);

    const methods = useForm<QuizFormValues>({
        resolver: zodResolver(quizSchema),
        defaultValues: { name: "", questions: [] },
    });

    const { handleSubmit, control, register, formState: { errors, isSubmitting } } = methods;

    const { fields: questionFields, append: addQuestion, remove: removeQuestion } = useFieldArray({
        control,
        name: "questions",
    });

    const handleAddQuestion = () => {
        addQuestion({
            id: null, // New question
            question: "",
            answers: [
                { id: null, answer: "", score: {} }, // New answers
                { id: null, answer: "", score: {} }
            ],
        });
    };

    const onSubmit: SubmitHandler<QuizFormValues> = async (data) => {
        try {
            console.log(data);
            await createQuizWithQuestions(data);
            navigate("/quizzes");
        } catch (err) {
            console.error(err);
        }
    };

    if (!isAdmin) return <ErrorMessage message="Error 403: Forbidden To Add Quiz" />;

    return (
        <main className="userinfo-container">
            <div className="user-info">
                <div className="user">
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input
                                className="signup-form-input"
                                placeholder="Quiz name"
                                {...register("name")}
                            />
                            {errors.name && <ErrorMessage message={errors.name.message!} />}

                            <hr />

                            {questionFields.map((field, index) => (
                                <QuestionForm
                                    key={field.id ?? `q-${index}`}
                                    register={register}
                                    control={control}
                                    qIndex={index}
                                    removeQuestion={removeQuestion}
                                    errors={errors}
                                />
                            ))}

                            <button type="button" className="add-button" onClick={handleAddQuestion}>
                                ➕ Add Question
                            </button>

                            <hr />

                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Quiz"}
                            </button>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </main>
    );
}
