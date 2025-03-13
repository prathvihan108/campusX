import React, { createContext, useContext, useState, useEffect } from "react";

import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { socket } from "../utils/socket.js";
import LoadingModel from "../components/Common/Loading/LoadingModel";

// Create Context
export const AuthContext = createContext();

// Auth Provider Component
const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null); // Store user info
	const [showLogin, setShowLogin] = useState(false);
	const [showSignup, setShowSignup] = useState(false);
	const [showLogout, setShowLogout] = useState(false);
	const [showLoading, setShowLoading] = useState(false);
	const [showCreatePost, setShowCreatePost] = useState(false);

	console.log("signup model state initil", showSignup);

	// Handle User Signup with Avatar Upload
	const handleSignUp = async (formData) => {
		setShowLoading(true);
		try {
			// FormData already constructed in Signup.jsx
			const response = await axiosInstance.post("/users/register/", formData, {
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
				setShowLoading(false);
				setShowSignup(false);
				setShowLogin(true);
			}
		} catch (error) {
			console.error("Signup Error:", error.response?.data);
			// Check for status code 409 (User already exists)
			console.log("Error response message:", error.response?.data);
			if (error.response?.status === 400) {
				toast.error(error.response?.data?.message, { autoClose: 3000 });
			}
			if (error.response?.status === 409) {
				toast.error(error.response?.data?.message, { autoClose: 3000 });
			} else {
				toast.error(error.response?.data?.message || "Signup failed!", {
					autoClose: 3000,
				});
			}
		}
	};

	const handleLogin = async (formData) => {
		setShowLoading(true);
		try {
			const response = await axiosInstance.post("/users/login/", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			// console.log("login Response received:", response.data);

			if (response?.data?.data?.user) {
				const userData = response?.data.data?.user;
				console.log("userData", userData);
				localStorage.setItem("userId", userData._id);

				// Emit register event for socket connection
				socket.emit("register", userData._id);
				console.log(" Registered socket for user:", userData._id);

				// Show success toast

				toast.success("Login successful! Redirecting.", { autoClose: 3000 });

				// Refresh Page
				setTimeout(() => {
					window.location.reload();
				}, 1000);

				// await new Promise((resolve) =>
				// 	setTimeout(() => {
				// 		setShowLoading(false);
				// 		resolve();
				// 	}, 4000)
				// );
				console.log("Login successful.");

				setUser(userData);
				setShowLoading(false);
				setShowLogin(false);
			}
		} catch (error) {
			console.error("status code:", error.response.status);
			// Check for status code 409 (User already exists)
			console.log("Error response message:", error.response.data.message);
			if (error.response.status === 400) {
				toast.error(error.response?.data?.message, { autoClose: 3000 });
			} else if (error.response.status === 404) {
				toast.error(error.response?.data?.message, { autoClose: 3000 });
			} else if (error.response.status === 401) {
				toast.error(error.response?.data?.message, { autoClose: 3000 });
			} else {
				toast.error(error.response?.data?.message || "Login failed!", {
					autoClose: 3000,
				});
			}
		}
	};

	const handleLogout = async () => {
		setShowLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 5000));
			console.log("user before removal", localStorage.getItem("user"));
			localStorage.removeItem("user");
			console.log("user after removal", localStorage.getItem("user"));
			const response = await axiosInstance.post(
				"/users/logout/",
				{},
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);

			console.log(response.status);
			if (response?.status == 200) {
				console.log("response", response);
				setUser(null);

				toast.success("Logged out successfully!", { autoClose: 2000 });

				console.log("User logged out.");
				// Refresh Page
				setTimeout(() => {
					window.location.reload();
				}, 1000);

				// await new Promise((resolve) =>
				// 	setTimeout(() => {
				// 		setShowLoading(false);
				// 		resolve();
				// 	}, 4000)
				// );
			}
		} catch (error) {
			console.log("error", error);
			console.log("error code", error.statusCode);
			if (error.statusCode === 401) {
				toast.error(error.message, {
					autoClose: 3000,
				});
			}
			console.log("Error logging out:", error.message);
			toast.error(error.response?.data?.message || "Logout failed!", {
				autoClose: 3000,
			});
		}
	};

	const fetchUser = async () => {
		try {
			const res = await axiosInstance.get("/users/current-user");
			console.log("fetchUser response", res.data?.data?.user);
			setUser(res.data?.data?.user);
		} catch (err) {
			if (err.response?.status === 401) {
				console.log("User not logged in");
				setUser(null);
			}
			if (err.response?.status === 403) {
				console.log("Access Token Expired, Trying to refresh...");
				try {
					await axiosInstance.post("/users/refresh-token");
					return fetchUser(); //  Retry original request
				} catch (refreshErr) {
					toast.error("Session expired, Please login again!");
				}
			}
			throw err;
		}
	};

	const handleCreatePost = async (postData) => {
		setShowLoading(true);
		try {
			const res = await axiosInstance.post("/posts/", postData);
			setShowCreatePost(false);
			setShowLoading(false);

			console.log("Post created", res.data?.data);
			toast.success("Post created successfully");
		} catch (err) {
			if (err.response?.status === 401) {
				console.log("User not logged in");
				toast.error("Please login to create post");
				setUser(null);
			}
			throw err;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				handleSignUp,
				handleLogin,
				handleLogout,
				showLogin,
				setShowLogin,
				showSignup,
				setShowSignup,
				showLogout,
				setShowLogout,
				showCreatePost,
				setShowCreatePost,
				handleCreatePost,
				fetchUser,
				showLoading,
				setShowLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
