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
		console.log("Signup Response received:", response.data);
		console.log("Created user", response?.data?.data?.createdUser);

		if (response?.data?.data?.createdUser) {
			toast.success("Signup successful! Please log in.", { autoClose: 3000 });
			console.log("Signup successful! Please log in.");

			// Close the Signup Modal if onClose is provided
			if (onClose) onClose();

			toast.success("Signup successful! Please log in.", { autoClose: false });
		}
	} catch (error) {
		console.error("Signup Error:", error.response?.data);
		toast.error(error.response?.data?.message || "Signup failed!", {
			autoClose: 3000,
		});
	}
};
