import React, {useEffect, useState} from "react";
import {fetchCurrentUser} from "../services/user-api.tsx";
import type {Run} from "../types/Run.tsx";
import {fetchAllRuns, fetchRunsByUserId} from "../services/run-api.tsx";
import {useNavigate} from "react-router-dom";
import {formatLocalDateTime} from "../utils/dateUtils.ts.tsx";

export default function Runs(props: {token: string}) {

    const [isAdmin, setIsAdmin] = useState<boolean>()
    const [runs, setRuns] = useState<Run[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        if (!props.token) return;

        const fetchData = async () => {
            try {
                const userResponse = await fetchCurrentUser();
                const isAdmin : boolean = userResponse.role === "ADMIN";
                setIsAdmin(isAdmin)

                if(isAdmin) {
                    const runResponse = await fetchAllRuns();
                    setRuns(runResponse)
                } else {
                    const runResponse = await fetchRunsByUserId(userResponse.id)
                    setRuns(runResponse)
                }

            } catch (error) {
                console.error("Failed to fetch question data:", error);
            }
        };
        fetchData();
    }, [props.token]);

    // Navigating the admin to each individual user's info page
    async function handleClick(_event: React.MouseEvent<HTMLTableRowElement>, run: Run) {
        const id = run.id

        navigate(`/runinfo/${id}`)
    }

    // This is every user row in the admin table
    const runElements = runs.map((run) =>
        (<tr onClick={event => handleClick(event, run)} key={run.id} className='user-table-row'>
            <td>{run.score.toString()}</td> {/* Should be adjusted according to the app's needs */}
            <td>{run.questionsAnswered}</td>
            {isAdmin && <td>{run.username}</td>}
            <td>{formatLocalDateTime(run.startedAt)}</td>
            <td>{run.finishedAt ? formatLocalDateTime(run.finishedAt) : "Currently playing"}</td>
        </tr>)
    )

    return (
        <div className='entities'>
            <h1>{!isAdmin && "User "}Runs</h1>
            <br/>
            <div className='scroll-container'>
                <table className='scroll'>
                    <thead>
                    <tr>
                        <th>Score</th>
                        <th>Questions Answered</th>
                        {isAdmin && <th>User</th>}
                        <th>Started At</th>
                        <th>Finished At</th>
                    </tr>
                    </thead>
                    <tbody className='scroll-body'>
                    {runElements}
                    </tbody>
                </table>
            </div>
        </div>
    )
}