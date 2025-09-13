// import viteLogo from "/Vitejs-logo.svg";
import reactLogo from "../assets/react.svg";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {fetchCurrentUser} from "../services/user-api.tsx";
import type {User} from "../types/BasicTypes.tsx";

export default function Home(props: { token: unknown; }) {
    const [count, setCount] = useState(0);

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
    }, [props.token])

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src="/vite.svg" className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p><br />
                {currentUser.role == "ADMIN" && <Link to="/users">View all users</Link>}
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
)
}