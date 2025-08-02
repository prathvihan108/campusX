import React, { useEffect, useState, useCallback } from "react";
import UserProfile from "./UserProfile";
import UserPosts from "./UserPosts";
import { useParams, useSearchParams } from "react-router-dom";
import {
	handleFollow,
	handleUnfollow,
	checkIsFollowing,
	fetchMyFollowers,
} from "../../services/followersServices";
import { toggleLike } from "../../services/likesServices";
import { toggleBookmark } from "../../services/bookmarksServices";
import { getPostsByUserId } from "../../services/postsServices";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const POSTS_PER_PAGE = 5;

const UserProfileLayout = () => {
	const { user, fetchUser } = useAuth();
	const [loading, setLoading] = useState(false);
	const [userPosts, setUserPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [followingMap, setFollowingMap] = useState({});

	const { userName } = useParams();
	const [searchParams] = useSearchParams();
	const userId = searchParams.get("id");
	const currentUserId = user?._id;

	useEffect(() => {
		fetchUser();
	}, []);

	const loadPosts = useCallback(async () => {
		if (!userId || !hasMore) return;

		setLoading(true);

		try {
			const posts = await getPostsByUserId(userId, page, POSTS_PER_PAGE);

			setUserPosts((prev) => [...prev, ...posts]);

			if (posts.length < POSTS_PER_PAGE) {
				setHasMore(false);
			}
		} catch (err) {
			console.error("Failed to fetch profile data:", err);
		} finally {
			setLoading(false);
		}
	}, [userId, page, hasMore]);

	useEffect(() => {
		setUserPosts([]);
		setPage(1);
		setHasMore(true);
	}, [userId]);

	useEffect(() => {
		loadPosts();
	}, [loadPosts]);

	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + window.scrollY >=
				document.body.offsetHeight - 500
			) {
				if (!loading && hasMore) {
					setPage((prevPage) => prevPage + 1);
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [loading, hasMore]);

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

	if (!userId) {
		return (
			<div className="flex justify-center items-center h-[300px]">
				<p className="text-gray-500 text-lg">Loading user...</p>
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto mt-3 px-4 sm:px-6 lg:px-8">
			{/* User Profile Section */}
			<section className="mb-10">
				<h2 className="text-3xl font-extrabold text-blue-800 dark:text-blue-800 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
					User Profile
				</h2>

				<UserProfile />
			</section>

			{/* Posts Section */}
			<section>
				<h2 className="text-3xl font-extrabold text-blue-800 dark:text-blue-800 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
					Posts
				</h2>

				<UserPosts
					userId={userId}
					currentUserId={currentUserId}
					toggleLike={toggleLike}
					toggleBookmark={toggleBookmark}
					toggleFollow={toggleFollow}
					followingMap={followingMap}
					fetchMyFollowers={fetchMyFollowers}
					posts={userPosts}
				/>

				{loading && (
					<div className="flex justify-center items-center py-4">
						<p className="text-gray-500">Loading more posts...</p>
					</div>
				)}

				{!hasMore && !loading && (
					<p className="text-center text-gray-400 py-4">
						No more posts to load.
					</p>
				)}
			</section>

			{/* Comment modal and nested routes */}
			<Outlet />
		</div>
	);
};

export default UserProfileLayout;
