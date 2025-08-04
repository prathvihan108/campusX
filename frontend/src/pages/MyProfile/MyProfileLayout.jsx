import React, { useEffect, useState, useCallback } from "react";
import MyProfile from "./MyProfile";
import MyPosts from "./MyPosts";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {
	handleFollow,
	handleUnfollow,
	checkIsFollowing,
	fetchMyFollowers,
} from "../../services/followersServices";
import { toggleLike } from "../../services/likesServices";
import { toggleBookmark } from "../../services/bookmarksServices";
import { getPostsByUserId, deletePostById } from "../../services/postsServices";
import { Outlet } from "react-router-dom";

const POSTS_PER_PAGE = 5;

const MyProfileLayout = () => {
	const { user, fetchUser } = useAuth();
	const [userReady, setUserReady] = useState(false);
	const [loading, setLoading] = useState(false);
	const [userPosts, setUserPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	// const [followingMap, setFollowingMap] = useState({});
	const currentUserId = user?._id;

	const deletePost = async (postId) => {
		try {
			await deletePostById(postId);

			toast.success("Post deleted successfully");
			setUserPosts((prev) => prev.filter((post) => post._id !== postId));
		} catch (error) {
			console.error("Failed to delete post:", error);
			toast.error("Failed to delete post");
		}
	};

	useEffect(() => {
		const initUser = async () => {
			try {
				await fetchUser();
			} catch (err) {
				console.error("Error loading user:", err);
			} finally {
				setUserReady(true);
			}
		};
		initUser();
	}, []);

	const loadPosts = useCallback(async () => {
		if (!currentUserId || !hasMore) return;
		setLoading(true);

		try {
			const posts = await getPostsByUserId(currentUserId, page, POSTS_PER_PAGE);
			setUserPosts((prev) => [...prev, ...posts]);

			if (posts.length < POSTS_PER_PAGE) setHasMore(false);

			// // Check follow status for new authors
			// const authorIds = [
			// 	...new Set(
			// 		posts
			// 			.map((post) => post.authorDetails._id)
			// 			.filter((id) => id !== currentUserId && !followingMap[id])
			// 	),
			// ];

			// if (authorIds.length > 0) {
			// 	const map = { ...followingMap };
			// 	await Promise.all(
			// 		authorIds.map(async (authorId) => {
			// 			const isFollowing = await checkIsFollowing(authorId);
			// 			map[authorId] = isFollowing;
			// 		})
			// 	);
			// 	setFollowingMap(map);
			// }
		} catch (err) {
			console.error("Failed to fetch posts:", err);
		} finally {
			setLoading(false);
		}
	}, [currentUserId, page, hasMore]);

	useEffect(() => {
		if (userReady) {
			if (page === 1) {
				setUserPosts([]);
				setHasMore(true);
			}
			loadPosts();
		}
	}, [userReady, currentUserId, page, loadPosts]);

	// Infinite scroll
	useEffect(() => {
		const onScroll = () => {
			if (
				window.innerHeight + window.scrollY >=
					document.body.offsetHeight - 500 &&
				!loading &&
				hasMore
			) {
				setPage((prev) => prev + 1);
			}
		};
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, [loading, hasMore]);

	const toggleFollow = async (userId) => {
		try {
			const isFollowing = followingMap[userId];
			if (isFollowing) await handleUnfollow(userId);
			else await handleFollow(userId);

			setFollowingMap((prev) => ({ ...prev, [userId]: !isFollowing }));
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
		<div className="max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
			{/* Profile Section */}
			<section className="mb-10">
				<h2 className="text-3xl font-extrabold text-blue-800 border-b border-blue-300 pb-2 mb-6">
					My Profile
				</h2>
				<MyProfile />
			</section>

			{/* Posts Section */}
			<section>
				<h2 className="text-3xl font-extrabold text-blue-800 border-b border-blue-300 pb-2 mb-6">
					My Posts
				</h2>
				<MyPosts
					userId={currentUserId}
					currentUserId={currentUserId}
					toggleLike={toggleLike}
					toggleBookmark={toggleBookmark}
					toggleFollow={toggleFollow}
					deletePost={deletePost}
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

			<Outlet />
		</div>
	);
};

export default MyProfileLayout;
