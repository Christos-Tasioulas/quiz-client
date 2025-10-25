import {authService} from "../services/auth-service.tsx";
import './Logout.css'
import {logout} from "../services/auth-api.tsx";


export default function Logout() {
    const handleLogout = async () => {
        try {
            await logout(); // optional API call
        } catch (e) {
            console.error("Logout failed:", e);
        } finally {
            authService.clearToken(); // clear token
            window.location.href='/login';               // remount App and reset state
        }
    };

    return (
        <div className="logout-container">
            <h1>Are you sure you want to logout?</h1>
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}
