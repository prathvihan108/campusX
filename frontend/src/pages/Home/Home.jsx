import React, { useContext, useEffect, useState } from "react";
import PostContext from "../../context/PostContext.js";
import FilterComponent from "../../components/Common/FilterComponent/FilterComponent.jsx";
import { toggleLike } from "../../services/likesServices.jsx";
import { toggleBookmark } from "../../services/bookmarksServices.jsx";
import {
	handleFollow,
	handleUnfollow,
} from "../../services/followersServices.jsx";
import PostCard from "../../components/Common/Posts/PostCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Home = () => {
	const { posts } = useContext(PostContext);
	const [loading, setLoading] = useState(true);
	const { fetchUser, user } = useAuth();

	const currentUserId = user?._id;

	useEffect(() => {
		fetchUser();
		if (posts.length > 0) {
			setLoading(false);
		}
	}, [posts]);

	return (
		<div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto mt-24">
			{/* Sidebar / Filter */}
			<aside className="lg:w-1/3 w-full">
				<div className="sticky top-28">
					<FilterComponent />
				</div>
			</aside>

			{/* Posts Feed */}
			<main className="lg:w-2/3 w-full">
				{loading ? (
					<div className="flex justify-center items-center h-[300px]">
						<p className="text-gray-500 text-lg">Loading...</p>
					</div>
				) : posts.length > 0 ? (
					<div className="grid md:grid-cols-2 gap-6 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-2 rounded-xl border border-gray-200 shadow-sm bg-white">
						{posts.map((post) =>
							post ? (
								<PostCard
									key={post._id}
									post={post}
									currentUserId={currentUserId}
									toggleLike={toggleLike}
									toggleBookmark={toggleBookmark}
									handleFollow={handleFollow}
									handleUnfollow={handleUnfollow}
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
	);
};

export default Home;
