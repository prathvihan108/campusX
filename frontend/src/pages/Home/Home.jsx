import React, { useContext, useEffect, useState } from "react";
import PostContext from "../../context/PostContext.js";
import HashtagSelector from "../../components/Common/HashTags/HashtagSelector.jsx";
import {
	currentUser,
	handleFollow,
	handleUnfollow,
} from "../../services/followersService.jsx";
import PostCard from "../../components/Common/Posts/PostCard.jsx";

const Home = () => {
	const { posts } = useContext(PostContext); // Get posts
	console.log("Posts from home:", posts);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log("Use effect running");
		if (posts.length > 0) {
			console.log("Posts length:", posts.length);
			setLoading(false); // Stop loading when posts are available
		}
	}, [posts]);

	return (
		<div className="p-4 my-[6.5rem]">
			<HashtagSelector />

			{loading ? (
				<p>Loading...</p>
			) : posts.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 h-fit">
					{Array.isArray(posts) && posts.length > 0 ? (
						posts.map((post) =>
							post ? (
								<PostCard
									key={post._id}
									post={post}
									currentUser={currentUser}
									handleFollow={handleFollow}
									handleUnfollow={handleUnfollow}
								/>
							) : null
						)
					) : (
						<p>No posts available.</p>
					)}
				</div>
			) : (
				<p>No posts available.</p>
			)}
		</div>
	);
};

export default Home;
