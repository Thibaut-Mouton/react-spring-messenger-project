export const generateColorMode = (isDarkMode: string) => {
    return isDarkMode === "dark" ? "dark" : "light";
}

export const generateIconColorMode = (isDarkMode: string) => {
    return isDarkMode === "dark" ? "#dcdcdc" : "#4A4A4A";
}

export const generateInputTextColorMode = (isDarkMode: string) => {
    return isDarkMode === "dark" ? "white" : "black"
}

export const generateLinkColorMode = (isDarkMode: string) => {
    return isDarkMode === "dark" ? "white" : "black"
}

export const generateClassName = (isDarkMode: string) => {
    return isDarkMode === "dark" ? "dark-t" : "light-t";
}