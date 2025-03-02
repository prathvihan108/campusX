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
		<div className=" lg:flex lg:flex-row p-4 justify-center my-[6.5rem] relative">
			<FilterComponent />

			{loading ? (
				<p>Loading...</p>
			) : posts.length > 0 ? (
				<div className="h-[70vh] w-full  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-lg border border-gray-300 shadow-md">
					<div className=" flex flex-col lg:grid lg:grid-cols-2 items-center justify-center gap-10 h-fit p-4">
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
				</div>
			) : (
				<p>No posts available.</p>
			)}
		</div>
	);
};

export default Home;
