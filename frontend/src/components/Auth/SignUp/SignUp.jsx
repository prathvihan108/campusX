import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Icons for password toggle

const Signup = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			alert("Passwords do not match!");
			return;
		}
		console.log({ username, email, password });
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="bg-white p-8 shadow-lg rounded-lg w-96">
				<h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
					Create an Account
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Username Input */}
					<div>
						<label className="block text-sm font-medium text-gray-600">
							Username
						</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
							placeholder="Enter your username"
							required
						/>
					</div>

					{/* Email Input */}
					<div>
						<label className="block text-sm font-medium text-gray-600">
							Email
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
							placeholder="Enter your email"
							required
						/>
					</div>

					{/* Password Input */}
					<div>
						<label className="block text-sm font-medium text-gray-600">
							Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
								placeholder="Enter your password"
								required
							/>
							<button
								type="button"
								className="absolute right-3 top-3 text-gray-500"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>
					</div>

					{/* Confirm Password Input */}
					<div>
						<label className="block text-sm font-medium text-gray-600">
							Confirm Password
						</label>
						<div className="relative">
							<input
								type={showConfirmPassword ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
								placeholder="Confirm your password"
								required
							/>
							<button
								type="button"
								className="absolute right-3 top-3 text-gray-500"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							>
								{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>
					</div>

					{/* Signup Button */}
					<button
						type="submit"
						className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
					>
						Sign Up
					</button>
				</form>

				{/* Login Link */}
				<p className="text-center text-sm text-gray-600 mt-4">
					Already have an account?{" "}
					<Link to="/login" className="text-blue-500 hover:underline">
						Log in
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Signup;
