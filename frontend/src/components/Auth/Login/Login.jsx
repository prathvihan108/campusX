import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";

const Login = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		userName: "",
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const { setShowLogin, handleLogin } = useAuth();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (Object.values(formData).some((value) => !value)) {
			alert("All fields are required!");
			return;
		}

		// Create FormData object
		const data = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			data.append(key, value);
		});

		// Debugging: Check FormData contents
		for (let pair of data.entries()) {
			console.log(pair[0], pair[1]);
		}

		// Call API function
		handleLogin(data, navigate);
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm z-50">
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
							name="userName"
							placeholder="Username"
							required
							onChange={handleChange}
							className="input"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-600">
							Email
						</label>
						<input
							type="email"
							name="email"
							placeholder="Email"
							required
							onChange={handleChange}
							className="input"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-600">
							Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								onChange={handleChange}
								className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
								placeholder="Enter your password"
								required
							/>
							<button
								type="button"
								className="absolute right-3 top-3"
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
