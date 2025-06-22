import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
	getComments,
	addComment,
	deleteComment,
} from "../../services/commentsServices.jsx";
import { X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const Comments = () => {
	const { postId } = useParams();
	const navigate = useNavigate();

	const [comments, setComments] = useState([]);
	const [newText, setNewText] = useState("");
	const { setShowLoading } = useAuth();
	const { user } = useAuth();
	console.log("user in comments#######", user);
	const [showPicker, setShowPicker] = useState(false);
	const pickerRef = useRef(null);

	// Same emoji adding logic
	const addEmoji = (emoji) => {
		setNewText((prev) => prev + emoji.emoji);
		setShowPicker(false);
	};

	// Close picker on outside click
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (pickerRef.current && !pickerRef.current.contains(event.target)) {
				setShowPicker(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Fetch comments when component mounts or postId changes
	useEffect(() => {
		const fetch = async () => {
			try {
				setShowLoading(true);
				const data = await getComments(postId);
				setComments(data);
			} catch (err) {
				console.error("Failed to load comments:", err);
			} finally {
				setShowLoading(false);
			}
		};
		fetch();
	}, [postId]);

	// Handle submitting a new comment
	const handleAddComment = async (e) => {
		e.preventDefault();
		if (!newText.trim()) return;

		try {
			const newComment = await addComment(postId, newText);
			setComments((prev) => [newComment, ...prev]);
			setNewText("");
		} catch (err) {
			console.error("Failed to post comment:", err);
		}
	};

	// Optional: Handle deleting a comment (only for author or post owner)
	const handleDelete = async (commentId) => {
		try {
			await deleteComment(commentId);
			setComments((prev) =>
				prev.filter((comment) => comment._id !== commentId)
			);
		} catch (err) {
			console.error("Failed to delete comment:", err);
		}
	};

	// Close modal (go back)
	const handleClose = () => navigate(-1);

	return (
		<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-start pt-10 px-4">
			<div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
				{/* Close Button */}
				<button
					onClick={handleClose}
					className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500"
				>
					<X size={24} />
				</button>

				{/* Title */}
				<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
					Comments
				</h2>

				{/* Add comment form */}
				<form onSubmit={handleAddComment} className="relative flex gap-2 mb-8">
					<input
						type="text"
						value={newText}
						onChange={(e) => setNewText(e.target.value)}
						placeholder="Write a comment..."
						className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
					/>
					<button
						type="button"
						onClick={() => setShowPicker((prev) => !prev)}
						className="text-2xl"
					>
						😀
					</button>
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
					>
						Post
					</button>

					{showPicker && (
						<div
							ref={pickerRef}
							className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-md rounded-lg p-2"
						>
							<EmojiPicker onEmojiClick={addEmoji} />
						</div>
					)}
				</form>

				{/* Comments List */}
				{comments.length === 0 ? (
					<p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
				) : (
					<div className="space-y-6">
						{comments.map((comment) => (
							<div
								key={comment._id}
								className="flex items-start gap-4 border-b pb-5"
							>
								{/* Avatar */}
								<img
									src={comment.author.avatar}
									alt={comment.author.fullName}
									className="w-12 h-12 rounded-full border-2 border-blue-400"
								/>

								{/* Comment Content */}
								<div className="flex-1">
									<div className="flex justify-between items-center">
										<div>
											<p className="font-semibold text-gray-800 dark:text-white">
												{comment.author.fullName}
											</p>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												{comment.author.email} • {comment.author.role},{" "}
												{comment.author.department} – {comment.author.year}
											</p>
										</div>
										{/* Delete button (only if user is author or post owner) */}
										{comment.author.email === user.email && (
											<button
												onClick={() => handleDelete(comment._id)}
												className="text-sm text-red-500 hover:underline"
											>
												Delete
											</button>
										)}
										{/* <button
											onClick={() => handleDelete(comment._id)}
											className="text-sm text-red-500 hover:underline"
										>
											Delete
										</button> */}
									</div>

									<p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
										{comment.content}
									</p>
									<p className="text-xs text-gray-400 mt-1">
										{new Date(comment.createdAt).toLocaleString()}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Comments;
