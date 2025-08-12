import React, { useState } from "react";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PostCard = ({
	post,
	currentUserId,
	toggleLike,
	toggleBookmark,
	deletePost,

	fetchMyFollowers,
}) => {
	const navigate = useNavigate();

	const [isLiked, setIsLiked] = useState(
		post.likes?.includes(currentUserId) || false
	);

	const [isBookmarked, setIsBookmarked] = useState(
		post.bookmarks?.includes(currentUserId) || false
	);

	const [LikesCount, setLikesCount] = useState(post.likesCount || 0);

	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const handleCardClick = () => {
		navigate(
			`/users/channel/${post.authorDetails.userName}?id=${post.authorDetails._id}`
		);
	};

	const stopClick = (e) => e.stopPropagation();

	const handleToggleLike = async (e) => {
		stopClick(e);
		await toggleLike(post._id);
		setIsLiked((prev) => !prev);
		setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
	};

	const handleToggleBookmark = async (e) => {
		stopClick(e);
		try {
			await toggleBookmark(post._id);
			setIsBookmarked((prev) => !prev);
		} catch (error) {
			console.error("Failed to toggle bookmark:", error);
		}
	};
	const handleDeletePost = async (e, postId) => {
		stopClick(e);
		try {
			await deletePost(postId);
		} catch (error) {
			console.error("Failed to delete post:", error);
		}
	};

	const handleDeleteClick = (e) => {
		e.stopPropagation();
		setShowConfirm(true);
	};

	const handleConfirmDelete = async (e) => {
		e.stopPropagation();
		try {
			await deletePost(post._id);
		} catch (err) {
			console.error("Failed to delete post:", err);
		}
		setShowConfirm(false);
	};

	const handleCancelDelete = (e) => {
		e.stopPropagation();
		setShowConfirm(false);
	};

	const openComments = (e) => {
		stopClick(e);
		navigate(`/post/${post._id}/comments`);
	};
	console.log("current user ID:", currentUserId);
	console.log("Post author ID:", post.authorDetails._id);

	return (
		<>
			<div
				onClick={handleCardClick}
				className="cursor-pointer hover:bg-gray-50 transition rounded-lg p-4 border border-gray-200 shadow-sm"
			>
				<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden p-6 transition-shadow duration-300 hover:shadow-lg h-fit border border-blue-900 dark:border-blue-500 !border-opacity-100 relative">
					{/* Delete button, only for post author */}
					{currentUserId === post.authorDetails._id && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								setShowDeleteModal(true);
							}}
							className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
							aria-label="Delete Post"
						>
							Delete
						</button>
					)}

					{/* Author Info */}
					<div className="flex items-center mb-4">
						<img
							src={post.authorDetails.avatar}
							alt={post.authorDetails.fullName}
							className="h-15 w-15 rounded-full border-2 border-gray-300 dark:border-gray-700 mr-4"
						/>
						<div>
							<h3
								onClick={(e) => {
									stopClick(e);
									navigate(`/users/channel/${post.authorDetails.userName}`);
								}}
								className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:underline"
							>
								{post.authorDetails.fullName}
							</h3>
							<p className="text-md text-blue-600">
								@{post.authorDetails.userName} [{post.authorDetails.role}]
							</p>
							<p className="text-md text-gray-600 dark:text-gray-400">
								{post.authorDetails.department} - {post.authorDetails.year}
							</p>
						</div>
					</div>

					{/* Post Content */}
					<p className="text-gray-800 dark:text-gray-300 mb-4 leading-relaxed">
						{post.content}
					</p>

					{/* Post Image */}
					{post.image && (
						<div className="h-[250px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 mb-4">
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

					{/* Actions (Like, Comment, Bookmark) */}
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center space-x-4">
							{/* Like */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									if (currentUserId) {
										handleToggleLike(e);
									} else {
										toast.info("Please log in to like posts", {
											autoClose: 500,
										});
									}
								}}
								className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors duration-200"
							>
								{isLiked ? (
									<Heart className="w-5 h-5 mr-2 text-red-500 fill-red-500" />
								) : (
									<Heart className="w-5 h-5 mr-2 text-red-500 fill-none" />
								)}
								<p className="text-red-500">{LikesCount}</p>
							</button>

							{/* Comment */}
							<button
								className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"
								onClick={(e) => {
									e.stopPropagation();
									if (currentUserId) {
										openComments(e);
									} else {
										toast.info("Please log in to comment", { autoClose: 500 });
									}
								}}
							>
								<MessageCircle className="w-5 h-5 mr-2" /> {post.commentCount}
							</button>

							{/* Bookmark */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									if (currentUserId) {
										handleToggleBookmark(e);
									} else {
										toast.info("Please log in to bookmark posts", {
											autoClose: 500,
										});
									}
								}}
								className={`flex items-center transition-colors duration-200 ${
									isBookmarked
										? "text-yellow-500"
										: "text-gray-600 dark:text-gray-400 hover:text-yellow-500"
								}`}
							>
								<Bookmark className="w-5 h-5 mr-2" />
								{isBookmarked ? "Saved" : "Save"}
							</button>
						</div>

						<span className="text-sm text-gray-600 dark:text-gray-400">
							Followers: {post.followerCount}
						</span>
					</div>
				</div>
			</div>

			{/* Confirmation Modal */}
			{showDeleteModal && (
				<div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
						<h2 className="text-lg font-semibold mb-4 text-red-600">
							Confirm Deletion
						</h2>
						<p className="mb-6 text-gray-700 dark:text-gray-300">
							Are you sure you want to delete this post? This action cannot be
							undone.
						</p>
						<div className="flex justify-end gap-3">
							<button
								onClick={() => setShowDeleteModal(false)}
								className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
							>
								No
							</button>
							<button
								onClick={(e) => {
									handleDeletePost(e, post._id);
									setShowDeleteModal(false);
								}}
								className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
							>
								Yes
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default PostCard;
