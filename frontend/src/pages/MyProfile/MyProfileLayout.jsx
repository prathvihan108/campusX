import React, { useEffect, useState } from "react";
import MyProfile from "./MyProfile";
import UserPosts from "./UserPosts";
import { useAuth } from "../../context/AuthContext";
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

const MyProfileLayout = () => {
	const { user, fetchUser } = useAuth();
	const [userReady, setUserReady] = useState(false);
	const [loading, setLoading] = useState(true);
	const [userPosts, setUserPosts] = useState([]);
	const [followingMap, setFollowingMap] = useState({});

	const currentUserId = user?._id;

	// Fetch user when layout first mounts
	useEffect(() => {
		const initUser = async () => {
			try {
				await fetchUser();
				setUserReady(true);
			} catch (err) {
				console.error("Error loading user:", err);
				setUserReady(true);
			}
		};
		initUser();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!currentUserId) return;

				const posts = await getPostsByUserId(currentUserId);
				setUserPosts(posts);

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
			} catch (err) {
				console.error("Failed to fetch profile data:", err);
			} finally {
				setLoading(false);
			}
		};

		if (userReady && currentUserId) {
			fetchData();
		}
	}, [userReady, currentUserId]);

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

	if (!userReady) {
		return (
			<div className="flex justify-center items-center h-[300px]">
				<p className="text-gray-500 text-lg">Loading user...</p>
			</div>
		);
	}

	return (
		<div className="relative">
			<div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto mt-10">
				{/* Profile Sidebar */}
				<aside className="lg:w-1/3 w-full">
					<div className="sticky top-28 space-y-4">
						<h2 className="text-xl font-semibold text-blue-800 border-b pb-2">
							🧑 Profile
						</h2>
						<MyProfile />
					</div>
				</aside>

				{/* Posts Section */}
				<main className="lg:w-2/3 w-full space-y-4">
					<h2 className="text-xl font-semibold text-blue-800 border-b pb-2">
						📝 Posts
					</h2>
					{loading ? (
						<div className="flex justify-center items-center h-[300px]">
							<p className="text-gray-500 text-lg">Loading posts...</p>
						</div>
					) : (
						<UserPosts
							userId={currentUserId}
							currentUserId={currentUserId}
							toggleLike={toggleLike}
							toggleBookmark={toggleBookmark}
							toggleFollow={toggleFollow}
							followingMap={followingMap}
							fetchMyFollowers={fetchMyFollowers}
						/>
					)}
				</main>
			</div>

			{/* Comment modal and nested routes */}
			<Outlet />
		</div>
	);
};

export default MyProfileLayout;
