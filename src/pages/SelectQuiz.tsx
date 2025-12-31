import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import type {Column, User} from "../types/BasicTypes.tsx";
import type {Quiz} from "../types/Quiz.tsx";
import {fetchCurrentUser} from "../services/user-api.tsx";
import {fetchAllQuizzes} from "../services/quiz-api.tsx";
import Table from "../components/Table.tsx";
import Modal from "../components/Modal.tsx";
import type {RunRequest} from "../types/Run.tsx";
import {createRun} from "../services/run-api.tsx";
import ErrorMessage from "../components/ErrorMessage.tsx";

export default function SelectQuiz (props: { token: string; }) {

    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>({} as User);
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const [isPlayModalOpen, setIsPlayModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
        if (!props.token) return;

        const fetchData = async () => {
            try {
                const userResponse = await fetchCurrentUser();
                setCurrentUser(userResponse);

                const quizzesResponse = await fetchAllQuizzes();
                setQuizzes(quizzesResponse);
            } catch (error) {
                console.error("Failed to fetch question data:", error);
            }
        };

        fetchData();
        console.log("Current user updated:", currentUser)
    }, [props.token]);

    const tableColumns: Column<Quiz>[] = [
        { key: "name", label: "Quiz", sortable: true },
        { key: "numberOfQuestions", label: "Total Questions", sortable: true }
    ]

    // Navigating the admin to each individual user's info page
    async function handleClick(_event: React.MouseEvent<HTMLTableRowElement>, quiz: Quiz) {
        setSelectedQuiz(quiz)
        setIsPlayModalOpen(true);
    }

    async function handleBegin() {
        if (!selectedQuiz) return;
        if (!currentUser) return null;

        setError(null);

        try {
            const runRequest: RunRequest = {
                quizId: selectedQuiz.id,
                userId: currentUser.id,
                score: {},
                totalQuestions: selectedQuiz.numberOfQuestions,
                questionsAnswered: 0,
            };

            const runResponse = await createRun(runRequest);
            navigate(`/runs/${runResponse.id}`);
        } catch (error) {
            setError("Unable to create run");
            console.error(error);
        } finally {
            setIsPlayModalOpen(false);
            setSelectedQuiz(null);
        }
    }


    async function handleBack() {
        navigate(`/`)
    }

    return (
        <div className='entities'>
            <h1>Select Quiz</h1>
            {error && <ErrorMessage message={error}/>}
            <Table
                data={quizzes}
                columns={tableColumns}
                onRowClick={(e, quiz: Quiz) => handleClick(e, quiz)}
            />
            <button onClick={handleBack}>Go Back</button>


            {isPlayModalOpen && selectedQuiz && (
                <Modal
                    message={`Do you want to play "${selectedQuiz.name}"?`}
                    onConfirm={handleBegin}
                    onCancel={() => {
                        setIsPlayModalOpen(false);
                        setSelectedQuiz(null);
                    }}
                />
            )}
        </div>
    )

}