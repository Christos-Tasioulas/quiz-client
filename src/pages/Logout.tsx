import {authService} from "../services/auth-service.tsx";
import './Logout.css'
import {logout} from "../services/auth-api.tsx";
import {useNavigate} from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout(); // optional API call
        } catch (e) {
            console.error("Logout failed:", e);
        } finally {
            authService.clearToken(); // remove token
            navigate("/login", { replace: true }); // soft redirect via React Router
        }
    };

    return (
        <div className='logout-container'>
            <h1>Are you sure you want to logout?</h1>
            <button className='logout-button' onClick={handleLogout}>Logout</button>
        </div>
    );
}