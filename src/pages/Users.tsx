import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {fetchCurrentUser, fetchUsers} from "../services/user-api.tsx";
import type {User} from "../types/BasicTypes.tsx";
import './Users.css'

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

    // This is every user row in the admin table
    const userElements = users.map((user) =>
        (<tr onClick={event => handleClick(event, user)} key={user.id} className='user-table-row'>
            <td>{user.username}</td>
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.email}</td>
        </tr>)
    )

    return(
        <div className='users'>
            <h1>User Info</h1>
            <br/>
            <div className='scroll-container'>
                <table className='scroll'>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Fullname</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody className='scroll-body'>
                    {userElements}
                    </tbody>
                </table>
            </div>
        </div>
    )
}