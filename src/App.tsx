import './App.css'
import Header from './components/Header';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from "./components/Footer.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Profile from "./pages/Profile.tsx";
import Logout from "./pages/Logout.tsx";
import {authService} from "./services/auth-service.tsx";
import {useEffect, useState} from "react";
import EditProfile from "./pages/EditProfile.tsx";
import Users from "./pages/Users.tsx";
import UserInfo from "./pages/UserInfo.tsx";
import {fetchCurrentUser} from "./services/user-api.tsx";
import type {User} from "./types/BasicTypes.tsx";
import Questions from "./pages/Questions.tsx";
import QuestionInfo from "./pages/QuestionInfo.tsx";
import AddQuestion from "./pages/AddQuestion.tsx";
import Run from "./pages/Run.tsx";
import Runs from "./pages/Runs.tsx";
import RunInfo from "./pages/RunInfo.tsx";
import Quizzes from "./pages/Quizzes.tsx";
import QuizInfo from "./pages/QuizInfo.tsx";
import AddQuiz from "./pages/AddQuiz.tsx";
import SelectQuiz from "./pages/SelectQuiz.tsx";
import QuizRuns from "./pages/QuizRuns.tsx";

function App() {

    const [token, setToken] = useState<string | undefined>("");
    const [currentUser, setCurrentUser] = useState<User>({} as User);

    useEffect(() => {
        const storedToken = authService.getToken();
        setToken(storedToken);
    }, []);

    // fetch current user whenever token changes
    useEffect(() => {
        if (!token) return;

        const getCurrentUser = async () => {
            try {
                const userResponse = await fetchCurrentUser();
                setCurrentUser(userResponse);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };

        getCurrentUser();
    }, [token]);


    useEffect(() => {
        // Check if user and preferredTheme exist
        if (currentUser?.preferredTheme) {
            document.body.className = currentUser.preferredTheme.toUpperCase();
            console.log(document.body.className)
        } else {
            // If no preferredTheme in currentUser, set the theme from localStorage (if available)
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme) {
                document.body.className = storedTheme.toUpperCase();
            } else {
                // Set default theme if neither is available
                document.body.className = 'light';
            }
        }
    }, [currentUser]);


    return (
        <>
            <BrowserRouter>
                <Header token={token} preferredTheme={currentUser.preferredTheme}/>
                <div className="App-container">
                    <Routes>
                        <Route path="/" element={<Home token={token || ""}/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/contact" element={<Contact/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/signup" element={<Signup/>}/>
                        <Route path="/profile" element={<Profile token={token || ""}/>}/>
                        <Route path="/editprofile" element={<EditProfile token={token || ""}/>}/>
                        <Route path="/logout" element={<Logout />}/>
                        <Route path="/users" element={<Users token={token || ""}/>}/>
                        <Route path="/userinfo/:id" element={<UserInfo token={token || ""}/>}/>
                        <Route path="/questions" element={<Questions token={token || ""}/>}/>
                        <Route path="/questioninfo/:id" element={<QuestionInfo token={token || ""}/>}/>
                        <Route path="/addquestion" element={<AddQuestion token={token || ""}/>}/>
                        <Route path="/runs/:id" element={<Run token={token || ""}/>}/>
                        <Route path="/runs/list" element={<Runs token={token || ""} />}/>
                        <Route path="/runinfo/:id" element={<RunInfo token={token || ""}/>}/>
                        <Route path="/quizzes" element={<Quizzes token={token || ""}/>}/>
                        <Route path="/quizinfo/:id" element={<QuizInfo token={token || ""}/>}/>
                        <Route path="/addquiz" element={<AddQuiz token={token || ""}/>}/>
                        <Route path="/selectquiz" element={<SelectQuiz token={token || ""}/>}/>
                        <Route path="/quiz/:id/runs" element={<QuizRuns token={token || ""}/>}/>
                    </Routes>
                </div>
                <Footer/>
            </BrowserRouter>
        </>
    )
}

export default App
