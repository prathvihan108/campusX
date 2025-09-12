import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../context/AuthContext.jsx";

const Signup = () => {
	const {
		handleSignUp,
		handleSendOtp,
		handleVerifyOtp,
		setShowSignup,
		setShowLogin,
	} = useAuth();

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
		avatar: null,
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [isOtpSent, setIsOtpSent] = useState(false);
	const [otp, setOtp] = useState("");
	const [emailError, setEmailError] = useState("");
	const [otpError, setOtpError] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);

	const handleChange = (e) => {
		if (e.target.name === "avatar") {
			setFormData({ ...formData, avatar: e.target.files[0] });
			setSelectedFile(e.target.files[0]);
		} else {
			setFormData({ ...formData, [e.target.name]: e.target.value });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// STEP 1 — Send OTP
		if (!isOtpSent) {
			const cmritPattern = /^[a-zA-Z0-9._%+-]+@cmrit\.ac\.in$/;
			if (!cmritPattern.test(formData.email)) {
				setEmailError("Email must be a valid @cmrit.ac.in address");
				return;
			}
			setEmailError("");

			if (formData.password !== formData.confirmPassword) {
				alert("Passwords do not match!");
				return;
			}

			const result = await handleSendOtp(formData.email);
			if (result.success) {
				setIsOtpSent(true);
			}
			return;
		}

		// STEP 2 — Verify OTP
		if (isOtpSent && otp) {
			const verifyResult = await handleVerifyOtp(formData.email, otp);
			if (!verifyResult.success) {
				setOtpError("Invalid OTP. Please try again.");
				return;
			}
			setOtpError("");

			// STEP 3 — Complete Signup
			const data = new FormData();
			Object.entries(formData).forEach(([key, value]) => {
				data.append(key, value);
			});

			await handleSignUp(data);
		}
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
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<input
						type="email"
						name="email"
						placeholder="Email(CMRIT Mail Id)"
						required
						onChange={handleChange}
						disabled={isOtpSent}
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{emailError && (
						<p className="text-red-500 col-span-2">{emailError}</p>
					)}

					<input
						type="text"
						name="fullName"
						placeholder="Full Name"
						required
						onChange={handleChange}
						disabled={isOtpSent}
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<select
						name="role"
						required
						onChange={handleChange}
						disabled={isOtpSent}
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
						disabled={isOtpSent}
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
						disabled={isOtpSent}
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
						disabled={isOtpSent}
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2 resize-none"
					/>

					<label className="block w-full col-span-2 p-2 border rounded cursor-pointer text-gray-500">
						{selectedFile ? selectedFile.name : "Choose Profile Picture"}
						<input
							type="file"
							name="avatar"
							accept="image/*"
							onChange={handleChange}
							required
							className="hidden"
							disabled={isOtpSent}
						/>
					</label>

					<div className="relative w-full">
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							placeholder="Password"
							required
							onChange={handleChange}
							disabled={isOtpSent}
							className="w-full p-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="button"
							className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>

					<div className="relative w-full">
						<input
							type={showConfirmPassword ? "text" : "password"}
							name="confirmPassword"
							placeholder="Confirm Password"
							required
							onChange={handleChange}
							disabled={isOtpSent}
							className="w-full p-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="button"
							className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						>
							{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>

					{/* OTP Input after OTP Sent */}
					{isOtpSent && (
						<div className="col-span-2">
							<label className="block text-sm font-medium text-gray-600">
								Enter OTP
							</label>
							<input
								type="text"
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
								className="input"
								placeholder="Enter the OTP sent to your email"
								required
							/>
							{otpError && <p className="text-red-500">{otpError}</p>}
						</div>
					)}

					<button
						type="submit"
						className="col-span-2 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
					>
						{isOtpSent ? "Verify OTP & Sign Up" : "Send OTP"}
					</button>
				</form>

				{/* <p className="text-center text-sm text-gray-600 mt-4">
					Already have an account?{" "}
					<Link to="/login" className="text-blue-500 hover:underline">
						Log in
					</Link>
				</p> */}
			</div>
		</div>
	);
};

export default Signup;
