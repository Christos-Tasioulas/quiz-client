import React, {useEffect, useState} from "react";
import type {Run} from "../types/Run.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {fetchCurrentUser} from "../services/user-api.tsx";
import { fetchRunsByQuiz, } from "../services/run-api.tsx";
import type {Column} from "../types/BasicTypes.tsx";
import {formatLocalDateTime} from "../utils/dateUtils.ts.tsx";
import Table from "../components/Table.tsx";

export default function QuizRuns(props: {token: string}) {
    const { id } = useParams<{ id: string }>();
    const [isAdmin, setIsAdmin] = useState<boolean>()
    const [runs, setRuns] = useState<Run[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        if (!props.token) return;

        const fetchData = async () => {
            try {
                const userResponse = await fetchCurrentUser();
                const isAdmin : boolean = userResponse.role === "ADMIN";
                setIsAdmin(isAdmin);

                if(isAdmin) {
                    const runResponse = await fetchRunsByQuiz(id);
                    setRuns(runResponse)
                }

            } catch (error) {
                console.error("Failed to fetch runs :", error);
            }
        };
        fetchData();
    }, [props.token]);

    // Navigating the admin to each individual user's info page
    async function handleClick(_event: React.MouseEvent<HTMLTableRowElement>, run: Run) {
        const id = run.id

        navigate(`/runinfo/${id}`)
    }

    const baseColumns: Column<Run>[] = [
        { key: "score", label: "Score", sortable: true, format: v => (v ? v.toString() : "-") },
        { key: "questionsAnswered", label: "Answered", sortable: true },
        { key: "startedAt", label: "Started At", sortable: true, format: v => formatLocalDateTime(v as string) },
        { key: "finishedAt", label: "Finished At", sortable: true, format: v => v ? formatLocalDateTime(v as string) : "Currently playing" },
    ];

    const tableColumns: Column<Run>[] = isAdmin
        ? [
            ...baseColumns.slice(0, 2), // Insert before "Started At"
            { key: "username", label: "User", sortable: true },
            ...baseColumns.slice(2),
        ]
        : baseColumns;


    return (
        <div className='entities'>
            <h1>Runs of {runs[0].quizName}</h1>
            <br/>
            <Table
                data={runs}
                columns={tableColumns}
                onRowClick={(e, run: Run) => handleClick(e, run)}
            />
        </div>
    )
}