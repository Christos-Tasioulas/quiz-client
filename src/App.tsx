import './App.css'
import Header from './components/Header';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
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


function App() {

    const [token, setToken] = useState<string | undefined>("");
    const [currentUser, setCurrentUser] = useState<User>({} as User);

    useEffect(() => {
        const storedToken = authService.getToken();
        setToken(storedToken);
    }, []);

    useEffect(() => {
        if (!token) return;

        const getCurrentUser = async () => {
            try {
                const userResponse = await fetchCurrentUser();
                setCurrentUser(userResponse);
            } catch (error) {
                console.error("Failed to fetch current user:", error);
            }
        };

        getCurrentUser();
    }, [token])

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
                        <Route path="/about" element={<About />}/>
                        <Route path="/contact" element={<Contact />}/>
                        <Route path="/login" element={<Login />}/>
                        <Route path="/signup" element={<Signup />}/>
                        <Route path="/profile" element={<Profile token={token || ""}/>}/>
                        <Route path="/editprofile" element={<EditProfile token={token || ""}/>}/>
                        <Route path="/logout" element={<Logout />}/>
                        <Route path="/users" element={<Users token={token || ""} />}/>
                        <Route path="/userinfo/:id" element={<UserInfo token={token || ""} />}/>
                        <Route path="/questions" element={<Questions token={token || ""}/>}/>
                    </Routes>
                </div>
                <Footer/>
            </BrowserRouter>
        </>
    )
}

export default App
