import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Backend API URL
const apiUrl = import.meta.env.VITE_API_URL;

// Create Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null); // Store user info
	const [showLogin, setShowLogin] = useState(false);
	const [showSignup, setShowSignup] = useState(false);

	// Handle Signup
	const handleSignUp = async (formData) => {
		try {
			const response = await axios.post(`${apiUrl}/users/register/`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			if (response?.data?.data?.createdUser) {
				toast.success("Signup successful! Please log in.", { autoClose: 3000 });
				setShowSignup(false);
				setShowLogin(true); // Open login modal after signup
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Signup failed!", {
				autoClose: 3000,
			});
		}
	};

	// Handle Login
	const handleLogin = async (credentials) => {
		try {
			const response = await axios.post(`${apiUrl}/users/login/`, credentials);
			setUser(response.data.user); // Store user data
			toast.success("Login successful!", { autoClose: 3000 });
			setShowLogin(false);
		} catch (error) {
			toast.error(error.response?.data?.message || "Login failed!", {
				autoClose: 3000,
			});
		}
	};

	// Handle Logout
	const handleLogout = () => {
		setUser(null);
		toast.success("Logged out successfully!", { autoClose: 3000 });
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				handleSignUp,
				handleLogin,
				handleLogout,
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

// Custom Hook to use AuthContext
export const useAuth = () => {
	return useContext(AuthContext);
};
