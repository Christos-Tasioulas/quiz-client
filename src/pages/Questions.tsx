import React, {useEffect, useState} from "react";
import type {Question} from "../types/Question.tsx";
import {useNavigate} from "react-router-dom";
import type {User} from "../types/BasicTypes.tsx";
import {fetchCurrentUser} from "../services/user-api.tsx";
import {fetchQuestions} from "../services/questions-api.tsx";

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
                console.error("Failed to fetch user data:", error);
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

    // This is every user row in the admin table
    const questionElements = questions.map((question) =>
        (<tr onClick={event => handleClick(event, question)} key={question.id} className='user-table-row'>
            <td>{question.question}</td>
        </tr>)
    )

    return(
        <div className='users'>
            <h1>Questions</h1>
            <br/>
            <div className='scroll-container'>
                <table className='scroll'>
                    <thead>
                    <tr>
                        <th>Question</th>
                    </tr>
                    </thead>
                    <tbody className='scroll-body'>
                    {questionElements}
                    </tbody>
                </table>
            </div>
        </div>
    )
}