import {useEffect, useState} from "react";
import {fetchCurrentUser} from "../services/user-api.tsx";
import type {User} from "../types/BasicTypes.tsx";
import type { QuizRequestWithQuestions} from "../types/Quiz";
import type { QuestionRequest } from "../types/Question";
import { createQuiz } from "../services/quiz-api";

export default function AddQuiz(props: { token: string }) {
    const [currentUser, setCurrentUser] = useState<User>({} as User);
    const [quizName, setQuizName] = useState("");
    const [questions, setQuestions] = useState<QuestionRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createdQuizId, setCreatedQuizId] = useState<string | null>(null);

    useEffect(() => {
        if (!props.token) return;

        const getCurrentUser = async () => {
            try {
                const userResponse = await fetchCurrentUser();
                setCurrentUser(userResponse);
            } catch (error) {
                console.error("Failed to fetch current user:", error);
            }
        };

        getCurrentUser();
    }, [props.token])

    const handleAddQuestion = (question: QuestionRequest) => {
        setQuestions([...questions, question]);
    };

    const handleCreateQuiz = async () => {
        if (!quizName) {
            setError("Quiz name is required");
            return;
        }
        if (questions.length < 1) {
            setError("At least one question is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Option 1: create quiz with all questions in one request
            const quizRequest: QuizRequestWithQuestions = {
                name: quizName,
                questions,
            };
            const createdQuiz = await createQuiz(quizRequest); // POST /quizzes/bulk or /quizzes
            setCreatedQuizId(createdQuiz.id);
            setQuestions([]); // clear form
            setQuizName("");
            console.log("Quiz created successfully:", createdQuiz);
        } catch (err) {
            console.error("Failed to create quiz:", err);
            setError("Failed to create quiz");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Add New Quiz</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div>
                <label>Quiz Name:</label>
                <input
                    type="text"
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                />
            </div>

            <div>
                <h3>Questions</h3>
                {questions.map((q, index) => (
                    <div key={index}>
                        <p>{q.question}</p>
                    </div>
                ))}

                {/* Example: add question dynamically */}
                <button
                    onClick={() =>
                        handleAddQuestion({
                            question: "Sample question?",
                            answers: [
                                { answer: "Answer 1", score: { points: 1 } },
                                { answer: "Answer 2", score: { points: 0 } },
                            ],
                        })
                    }
                >
                    Add Sample Question
                </button>
            </div>

            <button onClick={handleCreateQuiz} disabled={loading}>
                {loading ? "Creating..." : "Create Quiz"}
            </button>

            {createdQuizId && <p>Quiz created with ID: {createdQuizId}</p>}
        </div>
    );
}
