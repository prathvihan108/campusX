import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../context/AuthContext.jsx";

const Login = () => {
	const [formData, setFormData] = useState({
		userName: "",
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const { setShowLogin, handleLogin, handleSendResetOtp, handleResetPassword } =
		useAuth();

	// Forgot password states
	const [forgotMode, setForgotMode] = useState(false);
	const [resetStep, setResetStep] = useState(1);
	const [resetEmail, setResetEmail] = useState("");
	const [resetOtp, setResetOtp] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (Object.values(formData).some((value) => !value)) {
			alert("All fields are required!");
			return;
		}
		const data = new FormData();
		Object.entries(formData).forEach(([key, value]) => data.append(key, value));
		await handleLogin(data); // context handles API call
	};

	const sendOtpClick = async () => {
		if (!resetEmail) {
			alert("Please enter your email");
			return;
		}
		setLoading(true);
		const data = await handleSendResetOtp(resetEmail); // context handles API call
		if (data.success) {
			alert("OTP sent to your email");
			setResetStep(2);
		} else {
			alert(data.message || "Failed to send OTP");
		}
		setLoading(false);
	};

	const resetPasswordClick = async () => {
		if (!resetEmail || !resetOtp || !newPassword) {
			alert("All fields are required");
			return;
		}
		setLoading(true);
		const data = await handleResetPassword(resetEmail, resetOtp, newPassword);
		if (data.success) {
			alert("Password reset successful. Please log in.");
			setForgotMode(false);
			setResetStep(1);
			setResetEmail("");
			setResetOtp("");
			setNewPassword("");
		} else {
			alert(data.message || "Failed to reset password");
		}
		setLoading(false);
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
			<div className="bg-white p-8 shadow-lg rounded-lg w-96 relative">
				<button
					onClick={() => setShowLogin(false)}
					className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
				>
					✖
				</button>

				{!forgotMode ? (
					<>
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
									placeholder="Email(CMRIT Mail Id)"
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
						<div className="text-center mt-4">
							<button
								onClick={() => setForgotMode(true)}
								className="text-blue-600 hover:underline text-sm"
							>
								Forgot Password?
							</button>
						</div>
					</>
				) : (
					<>
						<h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
							Reset Password
						</h2>

						{resetStep === 1 && (
							<div className="space-y-4">
								<label className="block text-sm font-medium text-gray-600">
									Enter your registered email
								</label>
								<input
									type="email"
									value={resetEmail}
									onChange={(e) => setResetEmail(e.target.value)}
									className="input"
									placeholder="Enter your email"
									required
								/>
								<button
									onClick={sendOtpClick}
									disabled={loading}
									className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
								>
									{loading ? "Sending OTP..." : "Send OTP"}
								</button>
								<button
									className="w-full mt-2 text-gray-500 text-sm hover:underline"
									onClick={() => setForgotMode(false)}
								>
									Back to Login
								</button>
							</div>
						)}

						{resetStep === 2 && (
							<div className="space-y-4">
								<label className="block text-sm font-medium text-gray-600">
									Enter OTP
								</label>
								<input
									type="text"
									value={resetOtp}
									onChange={(e) => setResetOtp(e.target.value)}
									placeholder="Enter OTP"
									className="input"
									required
								/>
								<label className="block text-sm font-medium text-gray-600">
									New Password
								</label>
								<input
									type="password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									placeholder="Enter new password"
									className="input"
									required
								/>
								<button
									onClick={resetPasswordClick}
									disabled={loading}
									className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-200"
								>
									{loading ? "Resetting..." : "Change Password"}
								</button>
								<button
									className="w-full mt-2 text-gray-500 text-sm hover:underline"
									onClick={() => {
										setResetStep(1);
										setResetEmail("");
										setResetOtp("");
									}}
								>
									Back
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Login;
