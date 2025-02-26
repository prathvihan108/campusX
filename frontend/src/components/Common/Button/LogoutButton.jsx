import React from "react";
import { useAuth } from "../../../context/AuthContext.jsx";

function LogoutButton() {
	const { logout } = useAuth();

	return (
		<div>
			<button
				onClick={logout}
				className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
			>
				Logout
			</button>
		</div>
	);
}

export default LogoutButton;
