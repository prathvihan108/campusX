import { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
	const [themeMode, setThemeMode] = useState(
		localStorage.getItem("theme") || "light"
	);

	useEffect(() => {
		if (themeMode === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		localStorage.setItem("theme", themeMode);
	}, [themeMode]);

	const lightTheme = () => setThemeMode("light");
	const darkTheme = () => setThemeMode("dark");
	const toggleTheme = () =>
		setThemeMode((prev) => (prev === "light" ? "dark" : "light"));

	return (
		<ThemeContext.Provider
			value={{ themeMode, lightTheme, darkTheme, toggleTheme }}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export default function useTheme() {
	return useContext(ThemeContext);
}
