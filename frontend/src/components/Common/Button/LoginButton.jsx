import React from "react";

import { useState } from "react";
import Login from "../../Auth/Login/Login.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

function LoginButton() {
	// const [showLogin, setShowLogin] = useState(false);
	const { showLogin, setShowLogin } = useAuth();
	return (
		<div>
			<div className="relative">
				<button
					onClick={() => setShowLogin(true)}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Login
				</button>

				{/* Check if this logs when the button is clicked */}
				{showLogin && <Login />}
			</div>
		</div>
	);
}

export default LoginButton;
