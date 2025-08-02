import React from "react";
import PostCard from "../../components/Common/Posts/PostCard.jsx";

const UserPosts = ({
	posts, // receive posts from parent
	currentUserId,
	toggleLike,
	toggleBookmark,
	toggleFollow,
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
						isFollowing={followingMap[post.authorDetails._id] || false}
						fetchMyFollowers={fetchMyFollowers}
					/>
				) : null
			)}
		</div>
	);
};

export default UserPosts;
