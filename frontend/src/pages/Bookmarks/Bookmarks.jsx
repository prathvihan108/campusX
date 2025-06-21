import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { fetchBookmarks } from "../../services/bookmarksServices";

function BookMarks() {
	const [bookmarks, setBookmarks] = useState([]);
	const { setShowLoading } = useAuth();
	console.log("Bookmark page loading..");

	useEffect(() => {
		const getBookmarks = async () => {
			try {
				const bookmarkedPosts = await fetchBookmarks(setShowLoading);
				setBookmarks(bookmarkedPosts || []);
				console.log("\nBookmarks:", bookmarkedPosts);
			} catch (error) {
				console.error("Failed to fetch bookmarks:", error);
			} finally {
			}
		};

		getBookmarks();
	}, []);

	if (bookmarks.length === 0) {
		return (
			<p className="text-center mt-6 text-gray-500">No bookmarks found.</p>
		);
	}

	return (
		<div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto text-white">
			<h1 className="text-2xl font-semibold mb-6 text-center sm:text-left">
				Bookmarked Posts
			</h1>

			<div className="space-y-6">
				{bookmarks.map((post) => {
					const author = post.author;

					return (
						<div
							key={post._id}
							className="bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition"
						>
							{/* Author */}
							<div className="flex items-center mb-3">
								<img
									src={author.avatar}
									alt={author.fullName}
									className="w-11 h-11 rounded-full border-2 border-white mr-4"
								/>
								<div>
									<p className="font-semibold text-white">{author.fullName}</p>
									<p className="text-sm text-gray-400">@{author.userName}</p>
								</div>
							</div>

							{/* Post Content */}
							<p className="text-gray-200 text-sm sm:text-base mb-3 leading-relaxed">
								{post.content}
							</p>

							{post.image && (
								<img
									src={post.image}
									alt="Post"
									className="w-full max-h-60 object-cover rounded-md border border-gray-600"
								/>
							)}

							<div className="text-sm text-gray-400 mt-3">
								<span className="mr-4">Category: {post.category}</span>
								<span>{post.likesCount} likes</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default BookMarks;
