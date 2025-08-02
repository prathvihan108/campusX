import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { fetchBookmarks } from "../../services/bookmarksServices";
import { useNavigate } from "react-router-dom";

function BookMarks() {
	const [bookmarks, setBookmarks] = useState([]);
	const { setShowLoading, fetchUser } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		fetchUser();
	}, []);

	// Navigate to user profile
	const handleAuthorClick = (author) => {
		if (!author) return;
		navigate(`/users/channel/${author.userName}?id=${author._id}`);
	};

	const handleAuthorKeyDown = (e, author) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleAuthorClick(author);
		}
	};

	useEffect(() => {
		const getBookmarks = async () => {
			try {
				const bookmarkedPosts = await fetchBookmarks(setShowLoading);
				setBookmarks(bookmarkedPosts || []);
			} catch (error) {
				console.error("Failed to fetch bookmarks:", error);
			}
		};
		getBookmarks();
	}, []);

	if (bookmarks.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center mt-16 text-gray-600 dark:text-gray-400">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-12 w-12 mb-4 text-gray-400 dark:text-gray-500"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={1.5}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M5 5v14l7-4 7 4V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
					/>
				</svg>
				<p className="text-lg font-semibold">No bookmarks found</p>
				<p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
					You haven't saved any posts yet.
				</p>
			</div>
		);
	}

	return (
		<div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto text-white">
			<h1 className="text-3xl font-bold mb-6 text-center sm:text-left">
				Bookmarked Posts
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{bookmarks.map((post) => {
					const author = post.author;
					return (
						<article
							key={post._id}
							className="bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5"
						>
							{/* Author Info */}
							<div
								className="flex items-center mb-4 cursor-pointer"
								role="button"
								tabIndex={0}
								onClick={() => handleAuthorClick(author)}
								onKeyDown={(e) => handleAuthorKeyDown(e, author)}
								aria-label={`View profile of ${author.fullName}`}
							>
								<img
									src={author.avatar}
									alt={author.fullName}
									className="w-10 h-10 rounded-full border-2 border-blue-500 mr-4 object-cover"
								/>
								<div>
									<p className="text-white font-semibold text-base leading-tight">
										{author.fullName}
									</p>
									<p className="text-blue-400 text-sm">@{author.userName}</p>
								</div>
							</div>

							{/* Post Content */}
							<p className="text-gray-300 text-base mb-4 line-clamp-3 leading-relaxed self-start">
								{post.content}
							</p>

							{/* Optional Image */}
							{post.image && (
								<img
									src={post.image}
									alt="Post"
									className="w-full max-h-96 object-cover rounded-lg border border-gray-700 mb-4"
								/>
							)}

							{/* Meta info (category, likes) */}
							<div className="flex justify-between text-gray-400 text-sm font-medium">
								<span className="capitalize">#{post.category}</span>
								<span>{post.likesCount} likes</span>
							</div>
						</article>
					);
				})}
			</div>
		</div>
	);
}

export default BookMarks;
