import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const { setShowLogin } = useAuth();

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log({ username, password });
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
			<div className="bg-white p-8 shadow-lg rounded-lg w-96 relative">
				<button
					onClick={() => setShowLogin(false)}
					className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
				>
					✖
				</button>
				<h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
					Login to CampusX
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
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

					<button
						type="submit"
						className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
					>
						Login
					</button>
				</form>

				<p className="text-center text-sm text-gray-600 mt-4">
					Don't have an account?{" "}
					<Link to="/signup" className="text-blue-500 hover:underline">
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
