import type { QuestionAnswered } from "../types/Run";
import {useEffect, useState} from "react";
import type {Question} from "../types/Question.tsx";
import {fetchQuestionById} from "../services/questions-api.tsx";
import ErrorMessage from "./ErrorMessage.tsx";
import {answer} from "../services/questions-answered-api.tsx";
import './Question.css';

interface QuestionProps {
    question: QuestionAnswered;
    onAnswered: (updated: { answerId: number | undefined; questionId: number; questionAnswered: boolean; runId: number }) => void; // optional callback for parent
}

export default function Question({ question, onAnswered }: QuestionProps) {

    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localQuestion, setLocalQuestion] = useState(question);

    useEffect(() => {

        const fetchCurrentQuestion = async () => {
            try {
                const questionResponse = await fetchQuestionById(question.questionId.toString())
                setCurrentQuestion(questionResponse)
            } catch (error) {
                console.error(`Question Not Found ${error}`)
                setError(`Question Not Found ${error}`)
            }

        }

        fetchCurrentQuestion()

    }, [question]);

    // ⏳ Show loader while fetching
    if (!currentQuestion && !error) {
        return (
            <div className="question-loading">
                Loading question...
            </div>
        );
    }

    // ❌ Error state
    if (error) {
        return <ErrorMessage message={error} />;
    }


    const handleSelectAnswer = async (id: number | undefined) => {
        if (localQuestion.questionAnswered || isSubmitting) return;

        // 1️⃣ Optimistic UI update
        const updated = {
            runId: question.runId,
            questionId: question.questionId,
            answerId: id,
            questionAnswered: true,
        };
        setIsSubmitting(true);

        try {
            // 2️⃣ Call API to persist
            await answer(question.id?.toString(), updated);
            // 3️⃣ Notify parent
            onAnswered?.(updated);

        } catch (err) {
            // 4️⃣ Revert and show error if API fails
            console.error("Failed to submit answer:", err);
            setError("Failed to submit answer. Please try again.");
            setLocalQuestion({ ...localQuestion, questionAnswered: false });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ✅ Build the answer elements
    const answerElements = currentQuestion?.answers.map((answer, index) => {
        const isSelected = question.answerId === answer.id;
        const isAnswered = question.questionAnswered;

        return (
            <label
                key={answer.id ?? index}
                className={`answer
          ${isSelected ? "-selected" : "-not-selected"}
          ${isAnswered ? "-answered" : ""}
        `}
            >
                <input
                    type="radio"
                    name={`question-${question.questionId}`} // same name for one group
                    value={answer.id}
                    checked={isSelected}
                    disabled={isSubmitting}
                    onChange={() => handleSelectAnswer(answer.id)}
                    className="answer-radio"
                />
                <span>{answer.answer}</span>
            </label>
        );
    });

    return (
        <div className="question-container">
            <h2 className="question">
                {question.questionText}
            </h2>

            <div className="answer-container">
                {answerElements}
            </div>
        </div>
    );
}
