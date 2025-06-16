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
		<div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
			<h1 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
				Bookmarked Posts
			</h1>
			<div className="space-y-4">
				{bookmarks.map((post) => {
					const author = post.author;

					return (
						<div
							key={post._id}
							className="border rounded-lg p-4 shadow hover:shadow-md transition bg-white"
						>
							<div className="flex items-center mb-2">
								<img
									src={author.avatar}
									alt={author.fullName}
									className="w-10 h-10 rounded-full mr-3"
								/>
								<div>
									<p className="font-medium text-base">{author.fullName}</p>
									<p className="text-sm text-gray-500">@{author.userName}</p>
								</div>
							</div>

							<p className="text-gray-800 text-sm sm:text-base mb-2">
								{post.content}
							</p>

							{post.image && (
								<img
									src={post.image}
									alt="Post"
									className="w-full max-h-52 sm:max-h-60 object-cover rounded-md"
								/>
							)}

							<div className="text-sm text-gray-500 mt-2">
								<span>Category: {post.category}</span> ·{" "}
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
