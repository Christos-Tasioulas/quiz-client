import {Link} from "react-router-dom";
import './NavBar.css'

interface NavBarProps {
    token?: string | null | undefined
}

export default function NavBar({token}: NavBarProps) {

    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                {!token &&  <li><Link to="/login">Login</Link></li>}
                {!token &&  <li><Link to="/signup">Register</Link></li>}
                {token &&  <li><Link to="/profile">Profile</Link></li>}
                {token &&  <li><Link to="/logout">Logout</Link></li>}
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
        </nav>
    )
}