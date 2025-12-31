import { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quizSchema, type QuizFormValues } from "../types/quiz.schema";
import { useNavigate, useParams, Link } from "react-router-dom";

import { fetchCurrentUser } from "../services/user-api";
import {
    fetchQuizById,
    deleteQuiz,
    updateQuizWithQuestions
} from "../services/quiz-api";

import type { User } from "../types/BasicTypes";
import type { Quiz } from "../types/Quiz";

import QuestionForm from "../components/QuestionForm";
import ErrorMessage from "../components/ErrorMessage";
import EntityMenu from "../components/EntityMenu";
import Modal from "../components/Modal";

import {EyeIcon, Pencil, Trash} from "lucide-react";
import { v4 as uuid } from "uuid";

import "./QuizInfo.css";

export default function QuizInfo({ token }: { token: string }) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const isAdmin = currentUser?.role === "ADMIN";

    /* -------------------- form -------------------- */
    const methods = useForm<QuizFormValues>({
        resolver: zodResolver(quizSchema),
        defaultValues: { name: "", questions: [] },
    });

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        getValues,
    } = methods;

    /* -------------------- questions field array -------------------- */
    const {
        fields: questionFields,
        append: appendQuestion,
        remove: removeQuestion,
    } = useFieldArray({
        control,
        name: "questions",
    });

    /* -------------------- fetch user -------------------- */
    useEffect(() => {
        if (!token) return;
        fetchCurrentUser()
            .then(user => {
                console.log("Current user:", user);
                setCurrentUser(user);
            })
            .catch(console.error);
    }, [token]);

    /* -------------------- fetch quiz -------------------- */
    useEffect(() => {
        if (!id || !isAdmin) return;

        fetchQuizById(id)
            .then((quiz: Quiz) => {
                console.log("Fetched quiz:", quiz);

                reset({
                    id: quiz.id ?? null,
                    name: quiz.name,
                    questions: quiz.questions.map(q => ({
                        id: q.id ?? null,
                        question: q.question,
                        answers: q.answers.map(a => ({
                            id: a.id ?? null,
                            answer: a.answer,
                            score: a.score ?? {},
                        })),
                    })),
                });
            })
            .catch(console.error);
    }, [id, isAdmin, reset]);

    useEffect(() => {
        console.log(isSubmitting)
        console.log(errors)
    }, [isSubmitting, errors]);

    /* -------------------- submit -------------------- */
    const normalizeQuizPayload = (data: QuizFormValues): QuizFormValues => ({
        ...data,
        id: data.id ? Number(data.id) : null,
        questions: data.questions.map(q => ({
            ...q,
            id: q.id ? Number(q.id) : null,
            answers: q.answers.map(a => ({
                ...a,
                id: a.id ? Number(a.id) : null,
            })),
        })),
    });


    const onSubmit = async (data: QuizFormValues) => {
        if (!id) return;

        const normalized = normalizeQuizPayload(data);
        console.log("Normalized payload:", normalized);

        try {
            await updateQuizWithQuestions(id, normalized);
            setIsEditMode(false);
        } catch (err) {
            console.error(err);
        }
    };


    /* -------------------- delete -------------------- */
    const confirmDelete = async () => {
        if (!id) return;

        try {
            await deleteQuiz(id);
            navigate("/quizzes");
        } catch (err) {
            console.error(err);
        }
    };

    const menuOptions = useMemo(
        () => [
            { key: 1, Icon: EyeIcon, text: "View runs", onClick: () => navigate(`/quiz/${id}/runs`) },
            { key: 2, Icon: Pencil, text: "Edit Quiz", onClick: () => setIsEditMode(true) },
            { key: 3, Icon: Trash, text: "Delete Quiz", onClick: () => setIsDeleteModalOpen(true) },
        ],
        []
    );

    /* -------------------- render -------------------- */
    return (
        <main className="userinfo-container">
            <div className="user-info">
                <div className="user">

                    {!isEditMode && isAdmin && <EntityMenu menuOptions={menuOptions} />}

                    <FormProvider {...methods}>
                        {isEditMode ? (
                            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                <input
                                    className="signup-form-input"
                                    placeholder="Quiz name"
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <ErrorMessage message={errors.name.message!} />
                                )}

                                <hr />

                                {questionFields.map((field, index) => (
                                    <QuestionForm
                                        key={field.id ?? `q-${index}-${uuid()}`}
                                        qIndex={index}
                                        control={control}
                                        register={register}
                                        removeQuestion={() => removeQuestion(index)}
                                        errors={errors}
                                    />
                                ))}

                                <button
                                    type="button"
                                    className="add-button"
                                    onClick={() =>
                                        appendQuestion({
                                            id: null,
                                            question: "",
                                            answers: [
                                                { id: null, answer: "", score: {} },
                                                { id: null, answer: "", score: {} },
                                            ],
                                        })
                                    }
                                >
                                    ➕ Add Question
                                </button>

                                <div className="form-footer">
                                    <button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditMode(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h2 className="quiz-title">{getValues("name")}</h2>

                                <div className="questions">
                                    {getValues("questions").map((q, qi) => (
                                        <div
                                            className="question"
                                            key={q.id ?? `q-view-${qi}`}
                                        >
                                            <h3 className="question-title">{q.question}</h3>
                                            {q.answers.map((a, ai) => (
                                                <p
                                                    className="profile-contact"
                                                    key={a.id ?? `a-view-${qi}-${ai}`}
                                                >
                                                    {a.answer}
                                                </p>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                <div className="form-footer">
                                    <Link to="/quizzes">Go Back</Link>
                                </div>
                            </>
                        )}
                    </FormProvider>

                    {isDeleteModalOpen && (
                        <Modal
                            message="Are you sure you want to delete this quiz?"
                            onConfirm={confirmDelete}
                            onCancel={() => setIsDeleteModalOpen(false)}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}
