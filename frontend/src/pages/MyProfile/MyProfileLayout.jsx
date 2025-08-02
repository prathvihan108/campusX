import React, { useEffect, useState, useCallback } from "react";
import MyProfile from "./MyProfile";
import MyPosts from "./MyPosts";
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

const POSTS_PER_PAGE = 5;

const MyProfileLayout = () => {
	const { user, fetchUser } = useAuth();
	const [userReady, setUserReady] = useState(false);
	const [loading, setLoading] = useState(false);
	const [userPosts, setUserPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [followingMap, setFollowingMap] = useState({});

	const currentUserId = user?._id;

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

	const loadPosts = useCallback(async () => {
		if (!currentUserId || !hasMore) return;

		setLoading(true);

		try {
			const posts = await getPostsByUserId(currentUserId, page, POSTS_PER_PAGE);

			setUserPosts((prev) => [...prev, ...posts]);

			if (posts.length < POSTS_PER_PAGE) {
				setHasMore(false);
			}

			// Check follow status for new authors
			const authorIds = [
				...new Set(
					posts
						.map((post) => post.authorDetails._id)
						.filter((id) => id !== currentUserId && !followingMap[id])
				),
			];

			if (authorIds.length > 0) {
				const map = { ...followingMap };

				await Promise.all(
					authorIds.map(async (authorId) => {
						const isFollowing = await checkIsFollowing(authorId);
						map[authorId] = isFollowing;
					})
				);

				setFollowingMap(map);
			}
		} catch (err) {
			console.error("Failed to fetch posts:", err);
		} finally {
			setLoading(false);
		}
	}, [currentUserId, page, hasMore, followingMap]);

	// Reset posts when user or page changes
	useEffect(() => {
		if (userReady) {
			if (page === 1) {
				setUserPosts([]); // clear posts on first page load
				setHasMore(true); // reset hasMore for new user or reload
			}
			loadPosts();
		}
	}, [userReady, currentUserId, page, loadPosts]);

	// Infinite scroll listener
	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + window.scrollY >=
					document.body.offsetHeight - 500 &&
				!loading &&
				hasMore
			) {
				setPage((prev) => prev + 1);
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
							MY Profile
						</h2>
						<MyProfile />
					</div>
				</aside>

				{/* Posts Section */}
				<main className="lg:w-2/3 w-full space-y-4">
					<h2 className="text-xl font-semibold text-blue-800 border-b pb-2">
						My Posts
					</h2>
					<MyPosts
						userId={currentUserId}
						currentUserId={currentUserId}
						toggleLike={toggleLike}
						toggleBookmark={toggleBookmark}
						toggleFollow={toggleFollow}
						followingMap={followingMap}
						fetchMyFollowers={fetchMyFollowers}
						posts={userPosts} // pass posts as prop
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
				</main>
			</div>

			<Outlet />
		</div>
	);
};

export default MyProfileLayout;
