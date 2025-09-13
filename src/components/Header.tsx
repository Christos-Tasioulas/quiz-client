import {useContext, useEffect} from "react";
import {ThemeContext} from "../context/ThemeContext.tsx";
import NavBar from "./NavBar.tsx";
import "./Header.css";
import LightThemeSVG from "../assets/LightThemeSVG.tsx";
import DarkThemeSVG from "../assets/DarkThemeSVG.tsx";
import type {Theme} from "../types/BasicTypes.tsx";

interface HeaderProps {
    token?: string | null
    preferredTheme: Theme
}

export default function Header({token, preferredTheme}: HeaderProps) {

    const {theme, setTheme, toggleTheme} = useContext(ThemeContext);

    // Set the theme once on first load based on preferredTheme
    useEffect(() => {
        if (preferredTheme) {
            setTheme(preferredTheme); // only if ThemeContext exposes setTheme
        }
    }, [preferredTheme, setTheme]);

    useEffect(() => {
        document.body.className = theme; // `light` or `dark`
    }, [theme]);

    return (
        <header className="header">
            <NavBar token={token}/>
            <button onClick={toggleTheme}>
                {theme === "LIGHT" ? <DarkThemeSVG/> : <LightThemeSVG/>}
            </button>
        </header>
    )
}