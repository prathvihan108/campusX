import React, { useEffect, useState } from "react";
import MyProfile from "./MyProfile"; // adjust path if needed
import UserPosts from "./UserPosts"; // or wherever you placed it
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
	const [followingMap, setFollowingMap] = useState({});
	const [userPosts, setUserPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	const currentUserId = user?._id;

	// Fetch user posts
	useEffect(() => {
		const fetchData = async () => {
			try {
				fetchUser();
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

		if (currentUserId) {
			fetchData();
		}
	}, [currentUserId]);

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
		<div className="relative">
			<div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto mt-10">
				{/* Profile Sidebar */}
				<aside className="lg:w-1/3 w-full">
					<div className="sticky top-28">
						<MyProfile />
					</div>
				</aside>

				{/* Posts Section */}
				<main className="lg:w-2/3 w-full">
					{loading ? (
						<div className="flex justify-center items-center h-[300px]">
							<p className="text-gray-500 text-lg">Loading...</p>
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

			{/* For comment modal (same as Home.jsx) */}
			<Outlet />
		</div>
	);
};

export default MyProfileLayout;
