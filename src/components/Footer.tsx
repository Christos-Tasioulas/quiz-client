import './Footer.css'
import githubLogo from "../assets/github-mark.svg";
import githubWhiteLogo from "../assets/github-mark-white.svg";
import {useContext} from "react";
import {ThemeContext} from "../context/ThemeContext.tsx";

export default function Footer() {

    const { theme } = useContext(ThemeContext);

    return (
        <footer className="footer">
            Template App All Rights Reserved
            <br/><br/><br/>
            Chris Tasioulas
            <br/><br/><br/>
            <a href="https://github.com/Christos-Tasioulas">
                <img src={theme == "LIGHT" ? githubLogo : githubWhiteLogo} className="logo-github" alt="Github logo"/>
                <p>Christos-Tasioulas</p>
            </a>
        </footer>
    )
}