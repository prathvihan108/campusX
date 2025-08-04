import React from "react";
import PostCard from "../../components/Common/Posts/PostCard.jsx";

const MyPosts = ({
	posts,
	currentUserId,
	toggleLike,
	toggleBookmark,
	toggleFollow,
	deletePost,
	followingMap,
	fetchMyFollowers,
}) => {
	if (!posts) return null;

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
						deletePost={deletePost}
						fetchMyFollowers={fetchMyFollowers}
					/>
				) : null
			)}
		</div>
	);
};

export default MyPosts;
