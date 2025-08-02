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

	// Fetch posts on page or userId change
	const loadPosts = useCallback(async () => {
		if (!userId || !hasMore) return;

		setLoading(true);

		try {
			const posts = await getPostsByUserId(userId, page, POSTS_PER_PAGE);

			posts.forEach((post, index) => {
				// If you want to print a specific field, for example `post.content`, do:
				console.log(
					`Post #${index + 1} content from userProfile:`,
					post.content
				);
			});

			// Append posts

			setUserPosts((prev) => [...prev, ...posts]);

			// If less than requested posts returned => no more pages
			if (posts.length < POSTS_PER_PAGE) {
				setHasMore(false);
			}
		} catch (err) {
			console.error("Failed to fetch profile data:", err);
		} finally {
			setLoading(false);
		}
	}, [userId, page, hasMore, followingMap]);

	useEffect(() => {
		// Reset posts when userId changes
		setUserPosts([]);
		setPage(1);
		setHasMore(true);
	}, [userId]);

	useEffect(() => {
		loadPosts();
	}, [loadPosts]);

	// Scroll handler to implement infinite scroll
	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + window.scrollY >=
				document.body.offsetHeight - 500 // Trigger near bottom, 500px threshold
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
		<div className="relative">
			<div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto mt-10">
				{/* Profile Sidebar */}
				<aside className="lg:w-1/3 w-full">
					<div className="sticky top-28 space-y-4">
						<h2 className="text-xl font-semibold text-blue-800 border-b pb-2">
							User Profile
						</h2>
						<UserProfile />
					</div>
				</aside>

				{/* Posts Section */}
				<main className="lg:w-2/3 w-full space-y-4">
					<h2 className="text-xl font-semibold text-blue-800 border-b pb-2">
						User Posts
					</h2>

					<UserPosts
						userId={userId}
						currentUserId={currentUserId}
						toggleLike={toggleLike}
						toggleBookmark={toggleBookmark}
						toggleFollow={toggleFollow}
						followingMap={followingMap}
						fetchMyFollowers={fetchMyFollowers}
						posts={userPosts} // pass the posts here
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

			{/* Comment modal and nested routes */}
			<Outlet />
		</div>
	);
};

export default UserProfileLayout;
