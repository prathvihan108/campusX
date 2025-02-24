import React from "react";

import { useState } from "react";
import Signup from "../../Auth/Signup/Signup.jsx";
function SignupButton() {
	const [showSignup, setShowSignup] = useState(false);

	console.log("Signup Modal State:", showSignup); // Debugging log

	return (
		<div>
			<div className="relative">
				<button
					onClick={() => setShowSignup(true)}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Signup
				</button>

				{/* Check if this logs when the button is clicked */}
				{showSignup && <Signup onClose={() => setShowSignup(false)} />}
			</div>
		</div>
	);
}

export default SignupButton;
