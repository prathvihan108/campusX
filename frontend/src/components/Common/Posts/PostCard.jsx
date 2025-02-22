import React from "react";
import { Heart, MessageCircle } from "lucide-react";
const PostCard = ({ post }) => {
	return (
		<div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden p-4 w-full h-full flex flex-col">
			{/* Author Info */}
			<div className="flex items-center space-x-3">
				<img
					src={post.author.avatar}
					alt={post.author.fullName}
					className="h-10 w-10 rounded-full border-2 border-gray-300"
				/>
				<div>
					<h3 className="text-md font-semibold text-gray-800 dark:text-white">
						{post.author.fullName}
					</h3>
					<p className="text-sm text-gray-500">@{post.author.userName}</p>
				</div>
			</div>

			{/* Post Content */}
			<p className="mt-3 text-gray-700 dark:text-gray-300 flex-grow">
				{post.content}
			</p>

			{/* Post Image */}
			{post.image && (
				<img src={post.image} alt="Post" className="w-full mt-3 rounded-lg" />
			)}

			{/* Post Category */}
			<span className="mt-3 inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
				#{post.category}
			</span>

			{/* Likes & Comments */}
			<div className="flex justify-between items-center mt-4">
				<button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-500">
					❤️ <span className="ml-1">{post.likesCount}</span>
				</button>
				<button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500">
					💬 <span className="ml-1">{post.comments.length}</span>
				</button>
			</div>
		</div>
	);
};

export default PostCard;
