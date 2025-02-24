import React from "react";
import { NavLink } from "react-router-dom";

function LogIn() {
	return (
		<div>
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
		</div>
	);
}

export default LogIn;
