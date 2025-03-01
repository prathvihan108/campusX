import React, { useContext, useEffect, useState } from "react";
import PostContext from "../../context/PostContext.js";
import FilterComponent from "../../components/Common/FilterComponent/FilterComponent.jsx";
import {
	currentUser,
	handleFollow,
	handleUnfollow,
} from "../../services/followersService.jsx";
import PostCard from "../../components/Common/Posts/PostCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Home = () => {
	const { posts } = useContext(PostContext); // Get posts
	console.log("Posts from home:", posts);
	const [loading, setLoading] = useState(true);
	const { fetchUser } = useAuth();

	useEffect(() => {
		console.log("Use effect running");
		fetchUser(); //auth checker
		if (posts.length > 0) {
			console.log("Posts length:", posts.length);
			setLoading(false); // Stop loading when posts are available
		}
	}, [posts]);

	return (
		<div className=" flex flex-col p-4 justify-center my-[6.5rem] relative">
			<FilterComponent />

			{loading ? (
				<p>Loading...</p>
			) : posts.length > 0 ? (
				<div className="flex flex-col items-center justify-center  gap-10 h-fit">
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
