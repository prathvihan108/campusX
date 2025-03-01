import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../context/AuthContext.jsx";

const Signup = () => {
	const { handleSignUp, setShowSignup } = useAuth();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		userName: "",
		email: "",
		fullName: "",
		role: "",
		year: "",
		department: "",
		bio: "",
		password: "",
		confirmPassword: "",
		avatar: null, // Avatar file
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleChange = (e) => {
		if (e.target.name === "avatar") {
			setFormData({ ...formData, avatar: e.target.files[0] });
		} else {
			setFormData({ ...formData, [e.target.name]: e.target.value });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			alert("Passwords do not match!");
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
		handleSignUp(data, navigate);
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
			<div className="bg-white p-8 shadow-lg rounded-lg w-[50rem] max-w-full relative">
				<button
					onClick={() => setShowSignup(false)}
					className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
				>
					✖
				</button>

				<h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
					Create an Account
				</h2>

				<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
					<input
						type="text"
						name="userName"
						placeholder="Username"
						required
						onChange={handleChange}
						className="input"
					/>
					<input
						type="email"
						name="email"
						placeholder="Email"
						required
						onChange={handleChange}
						className="input"
					/>
					<input
						type="text"
						name="fullName"
						placeholder="Full Name"
						required
						onChange={handleChange}
						className="input"
					/>

					<select
						name="role"
						required
						onChange={handleChange}
						className="input"
					>
						<option value="">Select Role</option>
						{["Student", "Faculty", "Cell"].map((role) => (
							<option key={role} value={role}>
								{role}
							</option>
						))}
					</select>

					<select
						name="year"
						required
						onChange={handleChange}
						className="input"
					>
						<option value="">Select Year</option>
						{["First-Year", "Second-Year", "PreFinal-Year", "Final-Year"].map(
							(year) => (
								<option key={year} value={year}>
									{year}
								</option>
							)
						)}
					</select>

					<select
						name="department"
						required
						onChange={handleChange}
						className="input"
					>
						<option value="">Select Department</option>
						{["CSE", "ISE", "ECE", "EEE", "MBA", "AIML", "AIDS", "CIVIL"].map(
							(dept) => (
								<option key={dept} value={dept}>
									{dept}
								</option>
							)
						)}
					</select>

					<textarea
						name="bio"
						placeholder="Bio"
						required
						onChange={handleChange}
						className="input col-span-2"
					></textarea>

					{/* Avatar Upload */}
					<input
						type="file"
						name="avatar"
						accept="image/*"
						onChange={handleChange}
						className="input col-span-2"
					/>

					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							placeholder="Password"
							required
							onChange={handleChange}
							className="input"
						/>
						<button
							type="button"
							className="absolute right-3 top-3"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>

					<div className="relative">
						<input
							type={showConfirmPassword ? "text" : "password"}
							name="confirmPassword"
							placeholder="Confirm Password"
							required
							onChange={handleChange}
							className="input"
						/>
						<button
							type="button"
							className="absolute right-3 top-3"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						>
							{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>

					<button
						type="submit"
						className="col-span-2 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
					>
						Sign Up
					</button>
				</form>

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
