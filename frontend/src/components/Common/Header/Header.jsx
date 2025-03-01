import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext.jsx";

import SignupButton from "../Button/SignupButton.jsx";
import LoginButton from "../Button/LoginButton.jsx";
import LogoutButton from "../Button/LogoutButton.jsx";
import CreatePostButton from "../Button/CreatePostButton.jsx";
import ThemeToggler from "../Button/ThemeToggler.jsx";

const Header = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const { user } = useAuth();
	console;
	return (
		<header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md p-4 flex flex-row flex-wrap justify-between items-center z-50 ">
			{/* Profile Picture on the Left */}
			{user && (
				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-2 p-2 rounded-md bg-gray-800 dark:bg-gray-900">
						<img
							src={user.avatar}
							alt="Profile"
							className="h-8 w-8 rounded-full border border-gray-700 dark:border-gray-600"
						/>
						<div className="flex flex-col text-left">
							<h3 className="text-amber-200 dark:text-amber-300 text-sm font-semibold">
								{user.userName}
							</h3>
							<p className="text-blue-400 text-xs">{user.email}</p>
						</div>
					</div>

					{/* Create Post Button */}
					<CreatePostButton />
				</div>
			)}

			{/* Centered Logo and App Name */}
			<Link to="/" className="">
				<img
					src="https://drive.google.com/drive/folders/1e8rIluNzPiOlHDG71416RLhI7XpA2Hg8?usp=drive_link"
					className="h-12 w-12 rounded-full border-2 border-white shadow-md"
				/>
				<span className="font-bold text-2xl text-white drop-shadow-md">
					CampusX
				</span>
			</Link>
			{
				<div className="flex items-center gap-4">
					<ThemeToggler />

					{user ? (
						// If user is logged in, show Logout button
						<LogoutButton />
					) : (
						// If user is not logged in, show Login & Signup buttons
						<>
							<LoginButton />
							<SignupButton />
						</>
					)}
				</div>
			}

			{/* {!user ? (
				<>
					<SignupButton />
				</>
			) : (
				<>
					<button
						onClick={logout}
						className="px-4 py-2 bg-red-500 text-white rounded"
					>
						Logout
					</button>
				</>
			)} */}
		</header>
	);
};

export default Header;
