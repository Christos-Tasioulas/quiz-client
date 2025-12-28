import {useEffect, useState} from "react";
import {fetchCurrentUser} from "../services/user-api.tsx";
import type {User} from "../types/BasicTypes.tsx";

export default function QuizInfo(props: {token: string}) {

    const [currentUser, setCurrentUser] = useState<User>({} as User);

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

    return (
        <></>
    );
}