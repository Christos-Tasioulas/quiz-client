import { type Control, type FieldErrors, useFieldArray, type UseFormRegister } from "react-hook-form";
import type { QuizFormValues } from "../types/quiz.schema";
import AnswerForm from "./AnswerForm.tsx";
import './QuestionForm.css';
import ErrorMessage from "./ErrorMessage.tsx";

interface QuestionFormProps {
    qIndex: number;
    control: Control<QuizFormValues>;
    register: UseFormRegister<QuizFormValues>;
    removeQuestion: (index: number) => void;
    errors?: FieldErrors<QuizFormValues>;
}

export default function QuestionForm({
                                         qIndex,
                                         control,
                                         register,
                                         removeQuestion,
                                         errors
                                     }: QuestionFormProps) {
    const { fields: answerFields, append: addAnswer, remove: removeAnswer } = useFieldArray({
        control,
        name: `questions.${qIndex}.answers`,
    });

    return (
        <div className="question-form">
            <div className="question-form-header">
                <h4>Question {qIndex + 1}</h4>
                <button type="button" className="remove-button" onClick={() => removeQuestion(qIndex)}>❌</button>
            </div>

            <input
                className='signup-form-input'
                placeholder="Question text"
                {...register(`questions.${qIndex}.question`)}
            />
            {errors?.questions?.[qIndex]?.question?.message && (
                <ErrorMessage message={errors.questions[qIndex].question.message!} />
            )}

            {answerFields.map((answer, aIndex) => (
                <AnswerForm
                    key={answer.id}
                    qIndex={qIndex}
                    aIndex={aIndex}
                    register={register}
                    removeAnswer={() => removeAnswer(aIndex)}
                    errors={errors}
                    disableRemove={answerFields.length <= 2}
                />
            ))}

            <button type="button" className="add-button" onClick={() => addAnswer({ answer: "", score: {} })}>
                ➕ Add Answer
            </button>
        </div>
    );
}
