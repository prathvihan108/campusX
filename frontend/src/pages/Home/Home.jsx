import React, { useContext, useEffect, useState } from "react";
import PostContext from "../../context/PostContext";
import UniversalSearchBar from "../../components/Common/UniversalSearchBar/UniversalSearchBar.jsx";
import { toggleLike } from "../../services/likesServices.jsx";
import { toggleBookmark } from "../../services/bookmarksServices.jsx";
import { searchUsers } from "./../../services/userServices.jsx";
import { Outlet } from "react-router-dom";
import { useCallback } from "react";
import {
	handleFollow,
	handleUnfollow,
	checkIsFollowing,
	fetchMyFollowers,
} from "../../services/followersServices.jsx";
import PostCard from "../../components/Common/Posts/PostCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Home = () => {
	const { posts, loading, hasMore, fetchNextPage } = useContext(PostContext);
	const { fetchUser, user } = useAuth();

	const [followingMap, setFollowingMap] = useState({});
	const currentUserId = user?._id;

	//Search bar and post suggestions for seaching users and posts
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState([]);

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
		console.log("Selected user:", user);
	};

	// Fetch user on mount
	useEffect(() => {
		fetchUser();
	}, []);

	// Initialize following map whenever posts change
	useEffect(() => {
		const initializeFollowingMap = async () => {
			if (!posts || posts.length === 0) return;

			const authorIds = [
				...new Set(
					posts
						.map((post) => post.authorDetails._id)
						.filter((id) => id !== currentUserId)
				),
			];

			const map = {};
			await Promise.all(
				authorIds.map(async (authorId) => {
					const isFollowing = await checkIsFollowing(authorId);
					map[authorId] = isFollowing;
				})
			);

			setFollowingMap(map);
		};

		initializeFollowingMap();
	}, [posts, currentUserId]);

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

	const toggleFollow = async (userId) => {
		try {
			const isFollowing = followingMap[userId];
			if (isFollowing) {
				await handleUnfollow(userId);
			} else {
				await handleFollow(userId);
			}
			setFollowingMap((prev) => ({ ...prev, [userId]: !isFollowing }));
		} catch (err) {
			console.error("Follow toggle failed:", err);
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
										toggleFollow={toggleFollow}
										isFollowing={followingMap[post.authorDetails._id] || false}
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
