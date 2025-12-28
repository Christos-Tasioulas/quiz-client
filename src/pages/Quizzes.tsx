import Table from "../components/Table.tsx";
import React, {useEffect, useState} from "react";
import type {Quiz} from "../types/Quiz.tsx";
import type {Column, User} from "../types/BasicTypes.tsx";
import {useNavigate} from "react-router-dom";
import {fetchCurrentUser} from "../services/user-api.tsx";
import {fetchAllQuizzes} from "../services/quiz-api.tsx";

export default function Quizzes(props: {token: string}) {

    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User>({} as User);
    const [quizzes, setQuizzes] = useState<Quiz[]>([])

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
        console.log(currentUser)
    }, [props.token]);

    const tableColumns: Column<Quiz>[] = [
        { key: "name", label: "Quiz", sortable: true },
        { key: "numberOfQuestions", label: "Total Questions", sortable: true }
    ]

    // Navigating the admin to each individual user's info page
    async function handleClick(_event: React.MouseEvent<HTMLTableRowElement>, quiz: Quiz) {
        const id = quiz.id

        navigate(`/quizinfo/${id}`)
    }

    async function addQuiz(_event: React.MouseEvent<HTMLButtonElement>) {
        _event.preventDefault()
        navigate(`/addquiz`)
    }

    return (
        <div className='entities'>
            <h1>Quizzes</h1>
            <br/>
            <Table
                data={quizzes}
                columns={tableColumns}
                onRowClick={(e, quiz: Quiz) => handleClick(e, quiz)}
            />
            <button onClick={addQuiz}>Add Quiz</button>
        </div>
    )
}