import axios from "axios";
import { toast } from "react-toastify";

// Backend API URL (Make sure this is correctly set in `.env` file)
const apiUrl = import.meta.env.VITE_API_URL;

// Handle User Signup with Avatar Upload
export const handleSignUp = async (formData, navigate, onClose) => {
	try {
		// FormData already constructed in Signup.jsx
		const response = await axios.post(`${apiUrl}/users/register/`, formData, {
			headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
		});

		// Debugging: Log the response
		console.log("Signup Response:", response.data);

		if (response?.data?.data?.createdUser) {
			toast.success("Signup successful! Please log in.", { autoClose: 3000 });

			// Close the Signup Modal if onClose is provided
			if (onClose) onClose();

			// Navigate to login page
			navigate("/login");
		}
	} catch (error) {
		console.error("Signup Error:", error.response?.data);
		toast.error(error.response?.data?.message || "Signup failed!", {
			autoClose: 3000,
		});
	}
};
