import {authService} from "../services/auth-service.tsx";
import './Logout.css'
import {logout} from "../services/auth-api.tsx";

export default function Logout() {
    const handleLogout = async () => {
        // Clear the token from local storage
        authService.clearToken();
        await logout();
        // Redirect the user to the login page or another page
        window.location.href = '/login'; // Change '/login' to the appropriate path
    };

    return (
        <div className='logout-container'>
            <h1>Are you sure you want to logout?</h1>
            <button className='logout-button' onClick={handleLogout}>Logout</button>
        </div>
    );
}