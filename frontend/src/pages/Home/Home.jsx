import React, { useContext, useEffect, useState } from "react";
import PostContext from "../../context/PostContext.js";
import UniversalSearchBar from "../../components/Common/FilterComponent/UniversalSearchBar.jsx";
import { toggleLike } from "../../services/likesServices.jsx";
import { toggleBookmark } from "../../services/bookmarksServices.jsx";
import { Outlet } from "react-router-dom";
import {
	handleFollow,
	handleUnfollow,
	checkIsFollowing,
	fetchMyFollowers,
} from "../../services/followersServices.jsx";
import PostCard from "../../components/Common/Posts/PostCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Home = () => {
	const { posts } = useContext(PostContext);
	const [loading, setLoading] = useState(true);
	const { fetchUser, user } = useAuth();
	const [followingMap, setFollowingMap] = useState({});

	const currentUserId = user?._id;

	useEffect(() => {
		fetchUser();
		if (posts.length > 0) {
			setLoading(false);
		}
	}, [posts]);

	useEffect(() => {
		const initializeFollowingMap = async () => {
			try {
				if (!posts || posts.length === 0) return;

				// Get unique author IDs (excluding self if needed)
				const authorIds = [
					...new Set(
						posts
							.map((post) => post.authorDetails._id)
							.filter((id) => id !== currentUserId)
					),
				];

				// Step 2: Check follow status for each
				const map = {};
				await Promise.all(
					authorIds.map(async (authorId) => {
						const isFollowing = await checkIsFollowing(authorId);
						map[authorId] = isFollowing;
					})
				);

				setFollowingMap(map);
			} catch (err) {
				console.error("Error initializing following map:", err);
			}
		};

		initializeFollowingMap();
	}, [posts]);

	// { userId1: true, userId2: false, ... }

	const toggleFollow = async (userId) => {
		try {
			const isFollowing = followingMap[userId];

			if (isFollowing) {
				await handleUnfollow(userId);
			} else {
				await handleFollow(userId);
			}

			setFollowingMap((prev) => ({
				...prev,
				[userId]: !isFollowing,
			}));
		} catch (err) {
			console.error("Follow toggle failed:", err);
		}
	};

	return (
		<div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
			{/* Search Bar Container */}
			<div className="sticky top-6 z-20 bg-white bg-opacity-90 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg max-w-xl mx-auto px-4 py-3 flex items-center space-x-3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 text-gray-400 flex-shrink-0"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
					/>
				</svg>

				<input
					type="text"
					placeholder="Search by username or full name..."
					className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-700 text-base"
				/>
			</div>

			{/* Content below search bar */}
			<div className="mt-8 flex flex-col lg:flex-row gap-6">
				{/* Posts Feed */}
				<main className="w-full">
					{loading ? (
						<div className="flex justify-center items-center h-[300px]">
							<p className="text-gray-500 text-lg">Loading...</p>
						</div>
					) : posts.length > 0 ? (
						<div className="grid md:grid-cols-2 gap-6 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-2 rounded-xl border-4 border-blue-500 shadow-sm bg-white">
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
				</main>
			</div>

			{/* Modal like Comments */}
			<Outlet />
		</div>
	);
};

export default Home;
