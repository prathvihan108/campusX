import { use, useEffect, useState } from "react";
import { getPostsByUserId } from "../../services/postsServices.jsx";
import PostCard from "../../components/Common/Posts/PostCard.jsx";

const UserPosts = ({
	userId,
	currentUserId,
	toggleLike,
	toggleBookmark,
	toggleFollow,
	followingMap,
	fetchMyFollowers,
}) => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log(userId, currentUserId, "UserPosts component");
		const fetchPosts = async () => {
			try {
				const data = await getPostsByUserId(userId);
				setPosts(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, [userId]);

	if (loading)
		return <p className="text-center text-gray-500 mt-6">Loading...</p>;

	if (posts.length === 0)
		return <p className="text-center text-gray-500 mt-6">No posts found.</p>;

	return (
		<div className="space-y-4">
			{posts.map((post) =>
				post ? (
					<PostCard
						key={post._id}
						post={post}
						currentUserId={currentUserId}
						toggleLike={toggleLike}
						toggleBookmark={toggleBookmark}
						toggleFollow={toggleFollow}
						isFollowing={followingMap[post.authorDetails._id] || false}
						fetchMyFollowers={fetchMyFollowers}
					/>
				) : null
			)}
		</div>
	);
};

export default UserPosts;
