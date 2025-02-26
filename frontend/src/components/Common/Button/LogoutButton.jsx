import React from "react";
import { useAuth } from "../../../context/AuthContext.jsx";

function LogoutButton() {
	const { handleLogout } = useAuth();

	return (
		<div>
			<button
				onClick={handleLogout}
				className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
			>
				Logout
			</button>
		</div>
	);
}

export default LogoutButton;
