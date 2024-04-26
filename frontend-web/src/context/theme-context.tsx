import React, { useContext, useState } from "react"

type Theme = "light" | "dark";
type ThemeContextType = { theme: Theme; toggleTheme: () => void };

export const ThemeContext = React.createContext<ThemeContextType>(
  {} as ThemeContextType
)

export const ThemeProvider: React.FunctionComponent<any> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("dark")
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <ThemeContext.Provider value={{
	 theme,
	 toggleTheme
    }}>
	 {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = (): ThemeContextType => useContext(ThemeContext)
