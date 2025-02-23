import React, { useState, useEffect } from "react";
import axios from "axios";
import PostContext from "./PostContext";
import { createContext, useContext } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const PostContextProvider = ({ children }) => {
	const [posts, setPosts] = useState([]);

	// Fetch posts once when the component mounts
	console.log("'PostContextProvider' component mounted");
	useEffect(() => {
		const fetchAllPosts = async () => {
			try {
				const response = await axios.get(apiUrl + "posts/");
				console.log("Fetched posts:", response.data);
				setPosts(response.data.data);
			} catch (error) {
				console.error("Error fetching posts:", error);
			}
		};

		fetchAllPosts();
	}, []); // ✅ No unnecessary re-renders

	return (
		<PostContext.Provider value={{ posts, setPosts }}>
			{children}
		</PostContext.Provider>
	);
};

export default PostContextProvider;
