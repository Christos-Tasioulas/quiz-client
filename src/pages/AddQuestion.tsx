import {type ChangeEvent, useEffect, useState} from "react";
import type {TextInputProps, User} from "../types/BasicTypes.tsx";
import {fetchCurrentUser} from "../services/user-api.tsx";
import ErrorMessage from "../components/ErrorMessage.tsx";
import {Link, useNavigate} from "react-router-dom";
import FormInputs from "../components/FormInputs.tsx";
import DynamicFormInputs from "../components/DynamicFormInputs.tsx";
import {createQuestion} from "../services/questions-api.tsx";
import type {QuestionFormData} from "../types/Question.tsx";

export default function AddQuestion(props: { token: string }) {

    const [currentUser, setCurrentUser] = useState<User>({} as User);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [formData, setFormData] = useState<QuestionFormData>({
        question: "",
        answers: ["", ""]
    })
    // Message state that prints to the user if an error occurred in the register process
    const [message, setMessage] = useState("")
    const navigate = useNavigate()

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

    useEffect(() => {
        setIsAdmin(currentUser.role === "ADMIN");
    }, [currentUser]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Handle question field
        if (name === "question") {
            setFormData((prev) => ({
                ...prev,
                question: value,
            }));
        }

        // Handle answer fields like answer-0, answer-1, etc.
        else if (name.startsWith("answer-") || name.startsWith("field-")) {
            const index = parseInt(name.split("-")[1]);
            const updatedAnswers = [...formData.answers];
            updatedAnswers[index] = value;
            setFormData((prev) => ({
                ...prev,
                answers: updatedAnswers,
            }));
        }
    };

    const handleRemoveAnswers = (updatedAnswers: string[]) => {
        setFormData((prev) => ({
            ...prev,
            answers: updatedAnswers,
        }));
    };

    function validateForm(): string | null {
        if (!formData.question.trim()) return "Please enter a question";

        // Remove empty answers
        const cleanedAnswers = formData.answers.filter(a => a && a.trim() !== "");

        // Update state immediately
        setFormData(prev => ({
            ...prev,
            answers: cleanedAnswers
        }));

        if (cleanedAnswers.length < 2) return "You need at least 2 possible answers";

        return null;
    }

    const handleSave = async () => {
        const errorMessage = validateForm();
        if (errorMessage) {
            setMessage(errorMessage);
            return;
        }
        try {
            await createQuestion({
                question: formData.question,
                answers: formData.answers
                    .filter(a => a && a.trim() !== "")
                    .map(answer => ({ answer, score:{"score": null} })),
            });
            navigate("/questions");
        } catch (err) {
            console.error("Failed to create question:", err);
            setMessage("Failed to create question")
        }
    };

    const questionInputs: TextInputProps[] = [
        {id:1, type: "text", placeholder: "Question", className:"signup-form-input", name: "question", value: formData.question},
    ]

    const answerInputs = formData.answers.map((answer, index) => ({
        id: index + 1,
        type: "text",
        placeholder: `Answer ${index + 1}`,
        className: "signup-form-input",
        name: `answer-${index}`,
        value: answer,
    }));

    return (
        <main className="userinfo-container">
            <div className="user-info">
                <div className="user">
                    {isAdmin ? (
                        <div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}>
                                <ErrorMessage message={message}/>
                                <h1>New Question</h1>
                                <FormInputs textInputs={questionInputs} handleChange={handleChange}/>
                                <h2>Answers</h2>
                                <DynamicFormInputs
                                    initialInputs={answerInputs}
                                    handleChange={handleChange}
                                    handleRemove={handleRemoveAnswers}
                                    textInputClassName={"signup-form-input"}
                                />
                                <div className='form-footer'>
                                    <button type="submit">Save</button>
                                    <Link to="/questions">
                                        Go Back
                                    </Link>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <ErrorMessage message={"Error 403: Forbidden To Add Questions"}/>
                    )}
                </div>
            </div>
        </main>
    );
}