import {useContext, useEffect, useState} from "react";
import type {User} from "../types/BasicTypes.tsx";
import {ThemeContext} from "../context/ThemeContext.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {fetchCurrentUser} from "../services/user-api.tsx";
import {deleteQuestion, fetchQuestionById} from "../services/questions-api.tsx";
import deleteLight from "../assets/bin-shapes-and-symbols-svgrepo-com-light.svg";
import deleteDark from "../assets/bin-shapes-and-symbols-svgrepo-com.svg";
import Modal from "../components/Modal.tsx";
import type {Question} from "../types/Question.tsx";

export default function QuestionInfo(props: { token: string; }) {

    const [currentUser, setCurrentUser] = useState<User>({} as User);
    const [question, setQuestion] = useState<Question>({} as Question);
    const [answers, setAnswers] = useState<string[]>([]);
    const {theme} = useContext(ThemeContext);
    const {id} = useParams()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

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
                setAnswers(questionResponse.answers)
            } catch (error) {
                console.error("Failed to fetch question:", error);
            }
        }

        getQuestionById();

    }, [currentUser, currentUser.role, id])

    // User answer information as html elements
    const answerElements = answers.map((answer, index) => (
        <div key={index} className="profile-contact">
            <h3>{answer}</h3>
        </div>
    ))


    // Toggle the modal visibility
    const openModal = () => {
        setIsModalOpen(true);
    };

    const handleDelete = () => {
        openModal(); // Open the modal when delete is triggered
    };

    const confirmDelete = async () => {
        try {
            await deleteQuestion(question.id?.toString())
            console.log('Question deleted');
            setIsModalOpen(false);  // Close the modal after confirmation
            navigate("/questions")
        } catch (error: unknown) {
            console.log(error)
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false);  // Close the modal if the user cancels
    };

    return (
        <main className="userinfo-container">
            <div className="user-info">
                <div className="user">
                    {/* Delete Profile Button */}
                    <button onClick={handleDelete} style={{position: "relative", left: "75%", border: "none"}}>
                        <div className="delete">
                            <div className="delete-button">
                                <div className="delete-cog">
                                    <img
                                        src={theme == "LIGHT" ? deleteLight : deleteDark}
                                        alt="Delete User" className="delete-favicon"/>
                                </div>
                                <span>Delete Question</span>
                            </div>
                        </div>
                    </button>
                    <div className="userInfo">
                        {/* Important User Info */}
                        <h2 className='fullname'>{question?.question ?? "Loading..."}</h2>
                        <br/><br/><br/>
                        <div className='contacts'>
                            <h2 className='contacts-title'>Answers:</h2>
                            {answerElements.length > 0 ? answerElements : <p>No answers yet.</p>}
                        </div>
                    </div>
                    {/* Conditionally render the modal */}
                    {isModalOpen && (
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