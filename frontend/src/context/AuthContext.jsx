import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Backend API URL
const apiUrl = import.meta.env.VITE_API_URL;

// Create Context
export const AuthContext = createContext();

// Auth Provider Component
const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null); // Store user info
	const [showLogin, setShowLogin] = useState(false);
	const [showSignup, setShowSignup] = useState(false);

	useEffect(() => {
		console.log("signup model state initil", showSignup);
		const storedUser = JSON.parse(localStorage.getItem("user"));
		if (storedUser) setUser(storedUser);
	}, []);
	console.log("signup model state initil", showSignup);

	// Handle User Signup with Avatar Upload
	const handleSignUp = async (formData, navigate) => {
		try {
			// FormData already constructed in Signup.jsx
			const response = await axios.post(`${apiUrl}/users/register/`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			// Debugging: Log the response
			console.log("Signup Response received:", response.data);
			console.log("Created user", response?.data?.data?.createdUser);

			if (response?.data?.data?.createdUser) {
				const userData = response.data.data.createdUser;

				// Show success toast
				toast.success("Signup successful! Please log in.", { autoClose: 3000 });
				console.log("Signup successful! Please log in.");

				// // Store user in localStorage
				// localStorage.setItem("user", JSON.stringify(userData));

				// Update user state in AuthContext
				// setUser(userData);

				// Close the Signup modal and show Login modal
				setShowSignup(false);
				setShowLogin(true);
			}
		} catch (error) {
			console.error("Signup Error:", error.response?.data);
			// Check for status code 409 (User already exists)
			console.log("Error response message:", error.response?.data);
			if (error.response?.status === 409) {
				toast.error(error.response?.data?.message, { autoClose: 3000 });
			} else {
				toast.error(error.response?.data?.message || "Signup failed!", {
					autoClose: 3000,
				});
			}
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				handleSignUp,
				showLogin,
				setShowLogin,
				showSignup,

				setShowSignup,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
