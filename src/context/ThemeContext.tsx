import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type {Theme} from "../types/BasicTypes.tsx";


interface ThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
    theme: 'LIGHT', // default theme
    toggleTheme: () => {},
    setTheme: () => {}, // <-- add default no-op
});

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('LIGHT');

    // Get the theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    // Toggle the theme and save it to localStorage
    const toggleTheme = () => {
        const newTheme = theme === 'LIGHT' ? 'DARK' : 'LIGHT';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
