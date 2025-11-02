import React, {useEffect, useState} from "react";
import {fetchCurrentUser} from "../services/user-api.tsx";
import type {Run} from "../types/Run.tsx";
import {fetchAllRuns, fetchRunsByUserId} from "../services/run-api.tsx";
import {useNavigate} from "react-router-dom";
import {formatLocalDateTime} from "../utils/dateUtils.ts.tsx";
import Table from "../components/Table.tsx";
import type {Column} from "../types/BasicTypes.tsx";

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

    const tableColumns: Column<Run>[] = [
        { key: "score", label: "Score", sortable: true, format: v => (v ? v.toString() : "-") },
        { key: "questionsAnswered", label: "Answered", sortable: true},
        { key: "username", label: "User", sortable: true },
        { key: "startedAt", label: "Started At", sortable: true, format: v => formatLocalDateTime(v as string) },
        { key: "finishedAt", label: "Finished At", sortable: true, format: v => v ? formatLocalDateTime(v as string) : "Currently playing" },
    ]

    return (
        <div className='entities'>
            <h1>{!isAdmin && "User "}Runs</h1>
            <br/>
            <Table
                data={runs}
                columns={tableColumns}
                onRowClick={(e, run: Run) => handleClick(e, run)}
            />
        </div>
    )
}