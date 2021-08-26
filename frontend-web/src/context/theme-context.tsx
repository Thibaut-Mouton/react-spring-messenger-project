import React, {useContext, useState} from "react";
import {useCookies} from "react-cookie";

type Theme = "light" | "dark";
type ThemeContextType = { theme: Theme; toggleTheme: () => void };

export const ThemeContext = React.createContext<ThemeContextType>(
    {} as ThemeContextType
);

export const ThemeProvider: React.FC = ({children}) => {
    const [cookies] = useCookies(['pref-theme']);
    const [theme, setTheme] = useState<Theme>(cookies["pref-theme"] ? cookies["pref-theme"] : "light");
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };


    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);