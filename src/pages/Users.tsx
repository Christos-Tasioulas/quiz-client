import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {fetchCurrentUser, fetchUsers} from "../services/user-api.tsx";
import type {Column, User} from "../types/BasicTypes.tsx";
import './Users.css'
import Table from "../components/Table.tsx";

export default function Users(props: { token: string; }) {

    const [users, setUsers] = useState<User[]>([])
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User>({} as User);

    useEffect(() => {
        if (!props.token) return;

        const fetchData = async () => {
            try {
                const userResponse = await fetchCurrentUser();
                setCurrentUser(userResponse);

                const usersResponse = await fetchUsers();
                setUsers(usersResponse);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchData();
        console.log(currentUser)
    }, [props.token]);


    // Navigating the admin to each individual user's info page
    async function handleClick(_event: React.MouseEvent<HTMLTableRowElement>, user: User) {
        const id = user.id

        navigate(`/userinfo/${id}`)
    }

    const tableColumns: Column<User>[] = [
        {key: "username", label: "Username", sortable: true},
        {
            label: "Fullname",
            sortable: true,
            render: (user) => `${user.firstName} ${user.lastName}`,
            sortValue: (user) => `${user.firstName} ${user.lastName}`.toLowerCase(), // 👈 custom sort
        },
        {key: "email", label: "E-mail", sortable: true}
    ]

    return (
        <div className='entities'>
            <h1>User Info</h1>
            <br/>
            <Table
                data={users}
                columns={tableColumns}
                onRowClick={(event, user) => handleClick(event, user)}
            />
        </div>
    )
}