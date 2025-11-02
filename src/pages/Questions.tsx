import React, {useEffect, useState} from "react";
import type {Question} from "../types/Question.tsx";
import {useNavigate} from "react-router-dom";
import type {Column, User} from "../types/BasicTypes.tsx";
import {fetchCurrentUser} from "../services/user-api.tsx";
import {fetchQuestions} from "../services/questions-api.tsx";
import Table from "../components/Table.tsx";

export default function Questions(props: { token: string; }) {
    const [questions, setQuestions] = useState<Question[]>([])
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User>({} as User);

    useEffect(() => {
        if (!props.token) return;

        const fetchData = async () => {
            try {
                const userResponse = await fetchCurrentUser();
                setCurrentUser(userResponse);

                const questionsResponse = await fetchQuestions();
                setQuestions(questionsResponse);
            } catch (error) {
                console.error("Failed to fetch question data:", error);
            }
        };

        fetchData();
        console.log(currentUser)
    }, [props.token]);

    // Navigating the admin to each individual user's info page
    async function handleClick(_event: React.MouseEvent<HTMLTableRowElement>, question: Question) {
        const id = question.id

        navigate(`/questioninfo/${id}`)
    }

    async function addQuestion(_event: React.MouseEvent<HTMLButtonElement>) {
        _event.preventDefault()
        navigate(`/addquestion`)
    }

    const tableColumns: Column<Question>[] = [
        { key: "question", label: "Question", sortable: true },
    ]

    return(
        <div className='entities'>
            <h1>Questions</h1>
            <br/>
            <Table
                data={questions}
                columns={tableColumns}
                onRowClick={(e, question: Question) => handleClick(e, question)}
            />
            <button onClick={addQuestion}>Add Question</button>
        </div>
    )
}