import { useEffect, useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quizSchema } from "../types/quiz.schema";
import type { QuizFormValues } from "../types/quiz.schema";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../services/user-api.tsx";
import { createQuiz } from "../services/quiz-api.tsx";
import type { User } from "../types/BasicTypes.tsx";
import ErrorMessage from "../components/ErrorMessage.tsx";
import QuestionForm from "../components/QuestionForm.tsx";

export default function AddQuiz(props: { token: string }) {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User>();
    const isAdmin = currentUser?.role === "ADMIN";

    useEffect(() => {
        if (!props.token) return;
        fetchCurrentUser().then(setCurrentUser).catch(console.error);
    }, [props.token]);

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
            question: "",
            answers: [{ answer: "", score: {} }, { answer: "", score: {} }],
        });
    };

    const onSubmit = async (data: QuizFormValues) => {
        try {
            await createQuiz(data);
            navigate("/quizzes");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="userinfo-container">
            <div className="user-info">
                <div className="user">
                    {isAdmin ? (
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <input
                                    className="signup-form-input"
                                    placeholder="Quiz name"
                                    {...register("name")}
                                />
                                {errors.name && <ErrorMessage message={errors.name.message!} />}

                                <hr />

                                {questionFields.map((_, index) => (
                                    <QuestionForm
                                        key={index}
                                        register={register}
                                        control={control}
                                        qIndex={index}
                                        removeQuestion={removeQuestion}
                                        errors={errors}
                                    />
                                ))}

                                <button className="add-button" type="button" onClick={handleAddQuestion}>
                                    ➕ Add Question
                                </button>

                                <hr />

                                <button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Creating..." : "Create Quiz"}
                                </button>
                            </form>
                        </FormProvider>
                    ) : (
                        <ErrorMessage message="Error 403: Forbidden To Add Quiz" />
                    )}
                </div>
            </div>
        </main>
    );
}

