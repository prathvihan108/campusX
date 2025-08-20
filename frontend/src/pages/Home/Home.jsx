import React, { useContext, useEffect, useState } from "react";
import PostContext from "../../context/PostContext";
import UniversalSearchBar from "../../components/Common/UniversalSearchBar/UniversalSearchBar.jsx";
import ActiveUsers from "../../components/Common/ActiveUsers/ActiveUsers.jsx";
import { toggleLike } from "../../services/likesServices.jsx";
import { toggleBookmark } from "../../services/bookmarksServices.jsx";
import { searchUsers } from "./../../services/userServices.jsx";
import { deletePostById } from "../../services/postsServices.jsx";
import { Outlet } from "react-router-dom";
import { useCallback } from "react";
import { fetchMyFollowers } from "../../services/followersServices.jsx";
import PostCard from "../../components/Common/Posts/PostCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
	const { posts, setPosts, loading, hasMore, fetchNextPage } =
		useContext(PostContext);
	const { fetchUser, user } = useAuth();

	const currentUserId = user?._id;

	//Search bar and post suggestions for seaching users and posts
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const navigate = useNavigate();
	const handleSearch = useCallback(async (q) => {
		const users = await searchUsers(q);
		console.log("Search results:", users);
		setSuggestions(users);
		return users;
	}, []);

	//when the search is empty -reset
	useEffect(() => {
		if (query === "") {
			setSuggestions([]);
		}
	}, [query]);

	const handleSuggestionSelect = (user) => {
		// e.g., fetch posts by user._id and update posts shown on homepage
		navigate(`/users/channel/${user.userName}?id=${user._id}`);
		console.log("Selected user:", user);
	};

	// Fetch user on mount
	useEffect(() => {
		fetchUser();
	}, []);

	// Scroll event to trigger fetching next page
	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + window.scrollY >=
					document.body.offsetHeight - 300 &&
				hasMore &&
				!loading
			) {
				fetchNextPage();
				console.log("Fetching next page of posts...");
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [hasMore, loading, fetchNextPage]);

	const deletePost = async (postId) => {
		try {
			await deletePostById(postId);
			toast.success("Post deleted successfully");
			setPosts((prev) => prev.filter((post) => post._id !== postId));
		} catch (error) {
			toast.error("Failed to delete post");
			console.error("Failed to delete post:", error);
		}
	};

	return (
		<div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
			{/* Search Bar */}

			<UniversalSearchBar
				query={query}
				onQueryChange={setQuery}
				onSearch={handleSearch}
				suggestions={suggestions}
				onSuggestionSelect={handleSuggestionSelect}
			/>

			<ActiveUsers />

			<div className="mt-8 flex flex-col lg:flex-row gap-6">
				{/* Posts Feed */}
				<main className="w-full">
					{loading && posts.length === 0 ? (
						<div className="flex justify-center items-center h-[300px]">
							<p className="text-gray-500 text-lg">Loading...</p>
						</div>
					) : posts.length > 0 ? (
						<div className="grid md:grid-cols-2 gap-6 p-2">
							{posts.map((post) =>
								post ? (
									<PostCard
										key={post._id}
										post={post}
										currentUserId={currentUserId}
										toggleLike={toggleLike}
										toggleBookmark={toggleBookmark}
										deletePost={deletePost}
										fetchMyFollowers={fetchMyFollowers}
									/>
								) : null
							)}
						</div>
					) : (
						<div className="text-center text-gray-500 mt-10">
							No posts available.
						</div>
					)}

					{loading && posts.length > 0 && (
						<div className="flex justify-center py-4">
							<p className="text-gray-500">Loading more posts...</p>
						</div>
					)}
				</main>
			</div>

			{/* Comments modal */}
			<Outlet />
		</div>
	);
};

export default Home;
