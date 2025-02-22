import React, { useEffect, useState } from "react";
import { fetchAllPosts } from "../../services/homeService.jsx";
import {
	currentUser,
	handleFollow,
	handleUnfollow,
} from "../../services/followersService.jsx";
import PostCard from "../../components/Common/Posts/PostCard.jsx";

const Home = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getPosts = async () => {
			try {
				const response = await fetchAllPosts();
				setPosts(response.data);
			} catch (error) {
				console.error("Failed to fetch posts", error);
			} finally {
				setLoading(false);
			}
		};

		getPosts();
	}, []);

	return (
		<div className="p-4 my-[3.5rem]">
			<h1 className="text-2xl font-bold">Latest Posts</h1>

			{loading ? (
				<p>Loading...</p>
			) : posts.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 h-full">
					{posts.map((post) => (
						<PostCard
							key={post._id}
							post={post}
							currentUser={currentUser}
							handleFollow={handleFollow}
							handleUnfollow={handleUnfollow}
						/>
					))}
				</div>
			) : (
				<p>No posts available.</p>
			)}
		</div>
	);
};

export default Home;
