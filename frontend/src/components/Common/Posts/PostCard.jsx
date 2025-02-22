import React, { useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";

const PostCard = ({ post, currentUser, handleFollow, handleUnfollow }) => {
	const [isFollowing, setIsFollowing] = useState(
		post.followers.some((follower) => follower === currentUser._id)
	);
	const [followerCount, setFollowerCount] = useState(post.followerCount);

	const toggleFollow = async () => {
		if (isFollowing) {
			await handleUnfollow(post.authorDetails._id);
			setFollowerCount((prev) => prev - 1);
		} else {
			await handleFollow(post.authorDetails._id);
			setFollowerCount((prev) => prev + 1);
		}
		setIsFollowing(!isFollowing);
	};

	return (
		<div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden p-4 w-full h-full flex flex-col">
			{/* Author Info */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<img
						src={post.authorDetails.avatar}
						alt={post.authorDetails.fullName}
						className="h-12 w-12 rounded-full border-2 border-gray-300"
					/>
					<div>
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white">
							{post.authorDetails.fullName}
						</h3>
						<p className="text-md text-gray-500">
							@{post.authorDetails.userName}
						</p>
						<p className="text-md font-semibold text-green-700 dark:text-green-300 uppercase">
							{post.authorDetails.role}
						</p>
					</div>
				</div>
				{/* Follow Button */}
				<button
					onClick={toggleFollow}
					className={`px-4 py-2 text-md font-semibold rounded-lg ${
						isFollowing ? "bg-green-500 text-white" : "bg-blue-500 text-white"
					}`}
				>
					{isFollowing ? "Following" : "Follow"}
				</button>
			</div>

			<div className="border-t border-gray-300 my-4"></div>

			{/* Post Content */}
			<p className="mt-3 text-lg text-gray-700 dark:text-gray-300 flex-grow">
				{post.content}
			</p>

			{/* Post Image */}
			{post.image && (
				<img src={post.image} alt="Post" className="w-full mt-3 rounded-lg" />
			)}

			{/* Post Category */}
			<span className="mt-3 inline-block bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full">
				#{post.category}
			</span>

			{/* Likes, Comments & Followers */}
			<div className="flex justify-between items-center mt-4 text-lg">
				<button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-500">
					<Heart className="w-6 h-6 mr-1" /> {post.likeCount}
				</button>
				<button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500">
					<MessageCircle className="w-6 h-6 mr-1" /> {post.commentCount}
				</button>
				<span className="text-md text-gray-600 dark:text-gray-400">
					Followers: {followerCount}
				</span>
			</div>

			{/* DM Button */}
			<button className="flex items-center justify-center mt-3 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
				<Send className="w-5 h-5 mr-2" /> DM
			</button>
		</div>
	);
};

export default PostCard;
