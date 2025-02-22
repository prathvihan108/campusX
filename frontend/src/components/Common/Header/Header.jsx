import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [isDarkMode]);

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
	};

	return (
		<header className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between">
			{/* Logo and App Name */}
			<Link to="/" className="flex items-center space-x-2">
				<img
					src="https://images.pexels.com/photos/30818652/pexels-photo-30818652/free-photo-of-colorful-coal-tit-perched-on-branch-in-nature.jpeg?auto=compress&cs=tinysrgb&w=600"
					alt="App Logo"
					className="h-8 w-8"
				/>
				<span className="font-semibold text-xl text-blue-600 dark:text-gray-100">
					College Connect
				</span>
			</Link>

			{/* Profile Picture (Placeholder) and Theme Toggler */}
			<div className="flex items-center space-x-4">
				{/* Theme Toggler */}
				<button
					onClick={toggleTheme}
					className="text-gray-600 dark:text-gray-300"
				>
					{isDarkMode ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.364 6.364l-.707-.707m12.728 0l-.707.707M6.364 17.636l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
							/>
						</svg>
					)}
				</button>

				{/* Profile Picture (Placeholder) */}
				<img
					src="https://images.pexels.com/photos/5234256/pexels-photo-5234256.jpeg?auto=compress&cs=tinysrgb&w=600"
					alt="Profile"
					className="h-10 w-10 rounded-full"
				/>

				{/* Login and Signup Buttons */}
				<div className="space-x-2">
					<Link
						to="/login"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						Login
					</Link>
					<Link
						to="/signup"
						className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
					>
						Signup
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;
