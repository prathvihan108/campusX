import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext.jsx";

import SignupButton from "../Button/SignupButton.jsx";
import LoginButton from "../Button/LoginButton.jsx";
import LogoutButton from "../Button/LogoutButton.jsx";
import ThemeToggler from "../Button/ThemeToggler.jsx";

const Header = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const { user } = useAuth();
	return (
		<header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md p-4 flex flex-row flex-wrap justify-between items-center z-50 ">
			{/* Profile Picture on the Left */}
			{user && (
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
