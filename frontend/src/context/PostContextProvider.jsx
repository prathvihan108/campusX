import React, { useState, useEffect } from "react";
import PostContext from "./PostContext";
import axiosInstance from "../utils/axiosInstance";
import { useLocation } from "react-router-dom";

const LIMIT = 10; // posts per page

const PostContextProvider = ({ children }) => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);
	const location = useLocation();

	// Get userId from localStorage or other auth logic
	const currentUserId = localStorage.getItem("userId") || null;

	// Fetch posts for a given page
	const fetchPosts = async (pageToLoad) => {
		if (loading) return;
		setLoading(true);
		try {
			const response = await axiosInstance.get("/posts", {
				params: {
					userId: currentUserId,
					page: pageToLoad,
					limit: LIMIT,
				},
			});

			const newPosts = response.data.data || [];

			setPosts((prevPosts) =>
				pageToLoad === 1 ? newPosts : [...prevPosts, ...newPosts]
			);

			if (newPosts.length < LIMIT) {
				setHasMore(false);
			} else {
				setHasMore(true);
			}
		} catch (error) {
			console.error("Error fetching posts:", error);
		} finally {
			setLoading(false);
		}
	};

	// Fetch the first page when component mounts or when userId or location changes
	useEffect(() => {
		setPage(1);
		setHasMore(true);
		fetchPosts(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUserId, location.pathname]);

	// Function to load next page — can be called by any consumer (e.g. infinite scroll in UI)
	const fetchNextPage = () => {
		if (!loading && hasMore) {
			const nextPage = page + 1;
			setPage(nextPage);
			fetchPosts(nextPage);
		}
	};

	return (
		<PostContext.Provider
			value={{
				posts,
				loading,
				hasMore,
				fetchNextPage,
				refreshPosts: () => fetchPosts(1),
			}}
		>
			{children}
		</PostContext.Provider>
	);
};

export default PostContextProvider;
