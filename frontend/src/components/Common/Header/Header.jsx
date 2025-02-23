import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useTheme from "../../../context/Theme.jsx";

const Header = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const { themeMode, toggleTheme } = useTheme();

	return (
		<header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md p-4 flex flex-wrap justify-between items-center z-50 ">
			{/* Profile Picture on the Left */}
			{isLoggedIn && (
				<div className="flex items-center space-x-4">
					<img
						src="https://images.pexels.com/photos/5234256/pexels-photo-5234256.jpeg?auto=compress&cs=tinysrgb&w=600"
						alt="Profile"
						className="h-12 w-12 rounded-full border-2 border-white shadow-md"
					/>

					{/* Create Post Button */}
					<Link
						to="/create-post"
						className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
					>
						+ Create Post
					</Link>
				</div>
			)}

			{/* Centered Logo and App Name */}
			<Link to="/" className="">
				<img
					src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN37NaJKmAZha5MdD5fZcYbT4Jf9Mvg22T0cC_i_bX70PJwJ8Ojo25jjL-GB-QJDsJ&usqp=CAU"
					alt="App Logo"
					className="h-12 w-12 rounded-full border-2 border-white shadow-md"
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
					{themeMode === "dark" ? (
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
					{/* Login Button */}
					<NavLink
						to="/login"
						className={({ isActive }) =>
							`font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200 ${
								isActive
									? "bg-blue-700 text-white"
									: "bg-white text-blue-600 hover:bg-gray-100"
							}`
						}
					>
						Login
					</NavLink>

					{/* Signup Button */}
					<NavLink
						to="/signup"
						className={({ isActive }) =>
							`font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200 ${
								isActive
									? "bg-blue-700 text-white"
									: "bg-white text-blue-600 hover:bg-gray-100"
							}`
						}
					>
						Signup
					</NavLink>
				</div>
			</div>
		</header>
	);
};

export default Header;
