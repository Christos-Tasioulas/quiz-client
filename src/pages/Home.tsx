import reactLogo from "../assets/react.svg";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {fetchCurrentUser} from "../services/user-api.tsx";
import type {User} from "../types/BasicTypes.tsx";
import {createRun} from "../services/run-api.tsx";
import type {RunRequest} from "../types/Run.tsx";
import ErrorMessage from "../components/ErrorMessage.tsx";

export default function Home(props: { token: unknown; }) {
    const [count, setCount] = useState(0);

    const [currentUser, setCurrentUser] = useState<User>({} as User);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

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

    async function handleBegin() {
        setLoading(true);
        setError(null);
        try {
            const runRequest: RunRequest = {
                userId: currentUser.id,
                score: {},
                totalQuestions: 3,
                questionsAnswered: 0
            };
            const runResponse = await createRun(runRequest)

            navigate(`/runs/${runResponse.id}`);
        } catch (error: unknown) {
            setError("Unable to create run");
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

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
                {currentUser.role == "ADMIN" && <div className="admin-navbar">
                    <Link to="/users">View all users</Link>
                    <Link to="/quizzes">View all quizzes</Link>
                    <Link to="/runs/list">View all runs</Link>
                </div>}
                {currentUser.role == "USER" && <div className="user-navbar">
                    {error && <ErrorMessage message={error} />}
                    <button onClick={handleBegin} disabled={loading}><h2>{loading ? "Starting..." : "Begin"}</h2></button>
                </div>}
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
)
}