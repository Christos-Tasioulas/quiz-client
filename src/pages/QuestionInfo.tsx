import {type ChangeEvent, useEffect, useState} from "react";
import type {User} from "../types/BasicTypes.tsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {fetchCurrentUser} from "../services/user-api.tsx";
import {deleteQuestion, fetchQuestionById, updateQuestion} from "../services/questions-api.tsx";
import Modal from "../components/Modal.tsx";
import type {Answer, Question} from "../types/Question.tsx";
import FormInputs from "../components/FormInputs.tsx";
import EntityMenu from "../components/EntityMenu.tsx";
import './QuizInfo.css';
import DynamicFormInputs from "../components/DynamicFormInputs.tsx";
import ErrorMessage from "../components/ErrorMessage.tsx";
import {Pencil, Trash} from "lucide-react";

export default function QuestionInfo(props: { token: string; }) {

    const [currentUser, setCurrentUser] = useState<User>({} as User);
    const [question, setQuestion] = useState<Question>({} as Question);
    const [answers, setAnswers] = useState<string[]>([]);
    const {id} = useParams()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedQuestion, setEditedQuestion] = useState("");
    const [editedAnswers, setEditedAnswers] = useState<string[]>([]);
    const navigate = useNavigate();
    const [message, setMessage] = useState("")

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

    }, [props.token]);

    useEffect(() => {
        if (!currentUser || currentUser.role !== "ADMIN" || !id) return;

        const getQuestionById = async () => {
            try {
                const questionResponse = await fetchQuestionById(id)
                setQuestion(questionResponse)
                setAnswers(questionResponse.answers.map((answer: Answer) => answer.answer))
            } catch (error) {
                console.error("Failed to fetch question:", error);
            }
        }

        getQuestionById();

    }, [currentUser, currentUser.role, id, isEditMode])

    const questionInputs = [
        {
            id: 0,
            type: "text",
            placeholder: "Edit question text...",
            className: "form-input",
            name: "question",
            value: editedQuestion,
        }
    ];

    const answerInputs = editedAnswers
        .filter(a => a !== null && a !== undefined)
        .map((a, i) => ({
            id: i + 1,
            type: "text",
            placeholder: `Answer ${i + 1}`,
            className: "profile-contact",
            name: `answer-${i}`,
            value: a,
        }))


    // User answer information as html elements
    const answerElements = answers.map((answer, index) => (
        <div key={index} className="profile-contact">
            <h3>{answer}</h3>
        </div>
    ))

    const handleEditClick = () => {
        setEditedQuestion(question.question);
        setEditedAnswers(question.answers.map((answer) => answer.answer) || []);
        setIsEditMode(true);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if (name === "question") {
            setEditedQuestion(value);
        } else if (name.startsWith("answer-") || name.startsWith("field-")) {
            const index = parseInt(name.split("-")[1]);
            const updatedAnswers = [...editedAnswers];
            updatedAnswers[index] = value;
            setEditedAnswers(updatedAnswers);
        }
    };

    function validateForm(): string | null {
        if (!editedQuestion.trim()) return "Please enter a question";

        // Remove empty answers
        const cleanedAnswers = editedAnswers.filter(a => a && a.trim() !== "");

        if (cleanedAnswers.length < 2) return "You need at least 2 possible answers";

        return null;
    }

    const handleSave = async () => {
        try {
            const errorMessage = validateForm();
            if (errorMessage) {
                setMessage(errorMessage);
                return;
            }
            const filteredAnswers = editedAnswers.filter(a => a && a.trim() !== "");
            const updated = await updateQuestion(question.id!.toString(), {
                question: editedQuestion,
                answers: filteredAnswers.map(answer => ({answer, score:{"score": null}})),
            });
            setQuestion(updated);
            setIsEditMode(false);
        } catch (err) {
            console.error("Failed to update question:", err);
        }
    };

    // Toggle the modal visibility
    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        openDeleteModal(); // Open the modal when delete is triggered
    };

    const confirmDelete = async () => {
        try {
            await deleteQuestion(question.id?.toString())
            console.log('Question deleted');
            setIsDeleteModalOpen(false);  // Close the modal after confirmation
            navigate("/questions")
        } catch (error: unknown) {
            console.log(error)
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);  // Close the modal if the user cancels
    };

    const menuOptions = [
        {key: 1, Icon: Pencil, text: "Edit Question", onClick: handleEditClick},
        {
            key: 2,
            Icon: Trash,
            text: "Delete Question",
            onClick: handleDelete
        }
    ]

    return (
        <main className="userinfo-container">
            <div className="user-info">
                <div className="user">
                    {/* Delete & Edit question Button */}
                    {!isEditMode && <EntityMenu menuOptions={menuOptions}/>}
                    {/* Question display or edit form */}
                    <div className="userInfo">
                        {isEditMode ? (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}>
                                <ErrorMessage message={message}/>
                                <h1>Edit Question</h1>
                                <FormInputs textInputs={questionInputs} handleChange={handleChange}/>
                                <h2>Answers</h2>
                                <DynamicFormInputs
                                    initialInputs={answerInputs}
                                    handleChange={handleChange}
                                    handleRemove={setEditedAnswers}
                                    textInputClassName={"profile-contact"}
                                />
                                <div className='form-footer'>
                                    <button type="submit">Save</button>
                                    <button onClick={() => setIsEditMode(false)}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h2 className="fullname">{question.question}</h2>
                                <div className="contacts">
                                    <h2 className="contacts-title">Answers:</h2>
                                    {answerElements}
                                </div>
                                <Link to="/questions">
                                    Go Back
                                </Link>
                            </>
                        )}
                    </div>
                    {/* Delete Modal */}
                    {isDeleteModalOpen && (
                        <Modal
                            message="Are you sure you want to delete this question?"
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                        />
                    )}
                </div>
            </div>
        </main>
    )

}