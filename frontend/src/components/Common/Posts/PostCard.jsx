import React, { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";

const PostCard = ({ post, currentUserId, toggleLike }) => {
	const [isLiked, setIsLiked] = useState(
		post.likes.some((likeId) => likeId === currentUserId)
	);

	console.log("post id", post._id);
	console.log("post likes: ", post.likes);
	console.log("Is Liked:", isLiked);
	const [LikesCount, setLikesCount] = useState(post.likesCount);
	const [isBookmarked, setIsBookmarked] = useState(false);

	const handleToggleLike = async () => {
		if (isLiked) {
			await toggleLike(post._id);
			setLikesCount((prev) => prev - 1);
		} else {
			await toggleLike(post._id);
			setLikesCount((prev) => prev + 1);
		}
		setIsLiked(!isLiked);
	};

	const toggleBookmark = () => {
		setIsBookmarked(!isBookmarked);
	};

	return (
		<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden p-6 transition-shadow duration-300 hover:shadow-lg h-fit border border-blue-900 dark:border-blue-500 !border-opacity-100">
			{/* Author Info */}
			<div className="flex items-center mb-4">
				<img
					src={post.authorDetails.avatar}
					alt={post.authorDetails.fullName}
					className="h-12 w-12 rounded-full border-2 border-gray-300 dark:border-gray-700 mr-4"
				/>
				<div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
						{post.authorDetails.fullName}
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						@{post.authorDetails.userName} • {post.authorDetails.role}
					</p>
				</div>
				{/* <div className="ml-auto">
					<button
						onClick={toggleFollow}
						className={`px-4 py-2 text-sm font-semibold rounded-full ${
							isFollowing
								? "bg-green-500 hover:bg-green-600 text-white"
								: "bg-blue-500 hover:bg-blue-600 text-white"
						} transition-colors duration-200`}
					>
						{isFollowing ? "Following" : "Follow"}
					</button>
				</div> */}
			</div>

			{/* Post Content */}
			<p className="text-gray-800 dark:text-gray-300 mb-4 leading-relaxed">
				{post.content}
			</p>

			{/* Post Image */}
			{post.image && (
				<div className=" h-[250px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
					<img
						src={post.image}
						alt="Post"
						className="w-full h-full object-contain"
					/>
				</div>
			)}

			{/* Post Category */}
			<span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
				#{post.category}
			</span>

			{/* Actions */}
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center space-x-4">
					<button
						onClick={handleToggleLike}
						className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors duration-200"
					>
						{isLiked ? (
							<Heart className="w-5 h-5 mr-2 text-red-500 fill-red-500" />
						) : (
							<Heart className="w-5 h-5 mr-2 text-red-500 fill-none" />
						)}

						<p className="text-red-500">{LikesCount}</p>
					</button>
					<button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200">
						<MessageCircle className="w-5 h-5 mr-2" /> {post.commentCount}
					</button>
					<button
						className={`flex items-center transition-colors duration-200 ${
							isBookmarked
								? "text-yellow-500"
								: "text-gray-600 dark:text-gray-400 hover:text-yellow-500"
						}`}
						onClick={toggleBookmark}
					>
						<Bookmark className="w-5 h-5 mr-2" />{" "}
						{isBookmarked ? "Saved" : "Save"}
					</button>
				</div>
				<span className="text-sm text-gray-600 dark:text-gray-400">
					Followers: {post.followerCount}
				</span>
			</div>

			{/* DM Button */}
			<button className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center transition-colors duration-200">
				<Send className="w-4 h-4 mr-2" /> DM
			</button>
		</div>
	);
};

export default PostCard;
