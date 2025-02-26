import React from "react";

// import { useState } from "react";
import Signup from "../../Auth/Signup/Signup.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
function SignupButton() {
	// const [showSignup, setShowSignup] = useState(false);
	const { showSignup, setShowSignup } = useAuth();

	console.log("Signup Modal State:", showSignup);

	return (
		<div>
			<div className="relative">
				<button
					onClick={() => setShowSignup(true)}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Signup
				</button>

				{showSignup && <Signup />}
			</div>
		</div>
	);
}

export default SignupButton;
