import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { QuizFormValues } from "../types/quiz.schema";
import './AnswerForm.css';
import ErrorMessage from "./ErrorMessage.tsx";

interface AnswerFormProps {
    qIndex: number;
    aIndex: number;
    register: UseFormRegister<QuizFormValues>;
    removeAnswer: () => void;
    errors?: FieldErrors<QuizFormValues>;
    disableRemove?: boolean;
}

export default function AnswerForm({
                                       qIndex,
                                       aIndex,
                                       register,
                                       removeAnswer,
                                       errors,
                                       disableRemove = false,
                                   }: AnswerFormProps) {
    return (
        <div className="answer-form">
            <input
                className="signup-form-input"
                placeholder={`Answer ${aIndex + 1}`}
                {...register(`questions.${qIndex}.answers.${aIndex}.answer`)}
            />

            <button className="remove-button" type="button" disabled={disableRemove} onClick={removeAnswer}>
                ❌
            </button>

            {errors?.questions?.[qIndex]?.answers?.[aIndex]?.answer?.message && (
                <ErrorMessage message={errors.questions[qIndex].answers[aIndex].answer.message!} />
            )}
        </div>
    );
}
