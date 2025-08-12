// src/services/authService.js
import axiosInstance from "../utils/axiosInstance";

// Send Reset OTP
export async function sendResetOtpApi(email) {
	try {
		const res = await axiosInstance.post("/auth/send-reset-otp", { email });
		return res.data;
	} catch (error) {
		return error.response?.data || { success: false, message: "Network error" };
	}
}

// Reset Password
export async function resetPasswordApi(email, otp, newPassword) {
	try {
		const res = await axiosInstance.post("/auth/reset-password", {
			email,
			otp,
			newPassword,
		});
		return res.data;
	} catch (error) {
		return error.response?.data || { success: false, message: "Network error" };
	}
}
