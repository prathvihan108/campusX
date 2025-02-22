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
		<header className="bg-gradient-to-r from-blue-400 to-grey-400 shadow-md p-4 flex items-center relative">
			{/* Profile Picture on the Left */}
			<div className="flex items-center space-x-4">
				<img
					src="https://images.pexels.com/photos/5234256/pexels-photo-5234256.jpeg?auto=compress&cs=tinysrgb&w=600"
					alt="Profile"
					className="h-17 w-17 rounded-full border-2 border-white shadow-md"
				/>
			</div>

			{/* Centered Logo and App Name */}
			<Link
				to="/"
				className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2"
			>
				<img
					src="https://images.pexels.com/photos/30818652/pexels-photo-30818652/free-photo-of-colorful-coal-tit-perched-on-branch-in-nature.jpeg?auto=compress&cs=tinysrgb&w=600"
					alt="App Logo"
					className="h-17 w-17 rounded-full border-2 border-white shadow-md"
				/>
				<span className="font-bold text-2xl text-white drop-shadow-md">
					CampusX
				</span>
			</Link>

			{/* Login & Signup Buttons on the Right */}
			<div className="ml-auto flex items-center space-x-4">
				{/* Theme Toggler */}
				<button
					onClick={toggleTheme}
					className="text-white hover:text-gray-200 transition-all duration-200"
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

				{/* Login & Signup Buttons */}
				<div className="space-x-2">
					<Link
						to="/login"
						className="bg-white text-blue-600 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200"
					>
						Login
					</Link>
					<Link
						to="/signup"
						className="bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-800 transition-all duration-200"
					>
						Signup
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;
