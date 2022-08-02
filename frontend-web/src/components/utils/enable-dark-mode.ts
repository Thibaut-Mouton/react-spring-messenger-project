export const generateColorMode = (isDarkMode: string): string => {
  return isDarkMode === "dark" ? "dark" : "light"
}

export const generateIconColorMode = (isDarkMode: string): string => {
  return isDarkMode === "dark" ? "#dcdcdc" : "#4A4A4A"
}

export const generateLinkColorMode = (isDarkMode: string): string => {
  return isDarkMode === "dark" ? "white" : "black"
}

export const generateClassName = (isDarkMode: string): string => {
  return isDarkMode === "dark" ? "dark-t" : "light-t"
}
