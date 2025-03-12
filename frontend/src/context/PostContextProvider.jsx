import React, { useState, useEffect } from "react";
import PostContext from "./PostContext";
import axiosInstance from "../utils/axiosInstance";

const PostContextProvider = ({ children }) => {
	const [posts, setPosts] = useState([]);

	// Fetch posts once when the component mount
	console.log("'PostContextProvider' component mounted");
	useEffect(() => {
		const fetchAllPosts = async () => {
			try {
				const response = await axiosInstance.get("/posts/");

				console.log("Fetched posts:", response.data);
				setPosts(response.data.data);
			} catch (error) {
				console.error("Error fetching posts:", error);
			}
		};

		fetchAllPosts();
	}, []); // No unnecessary re-renders

	return (
		<PostContext.Provider value={{ posts, setPosts }}>
			{children}
		</PostContext.Provider>
	);
};

export default PostContextProvider;
