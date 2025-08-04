import axiosInstance from "../utils/axiosInstance";

// Toggle bookmark (add or remove)
export const toggleBookmark = async (postId) => {
	try {
		const response = await axiosInstance.post(`/bookmarks/${postId}`);
		console.log(response?.data?.message);
		return response?.data;
	} catch (error) {
		console.error("Error toggling bookmark:", error);
		throw error;
	}
};

// Fetch all bookmarked posts of the logged-in user
export const fetchBookmarks = async (page = 1, limit = 5, setShowLoading) => {
	try {
		if (setShowLoading) setShowLoading(true);

		// Append page and limit as query parameters
		const response = await axiosInstance.get(`/bookmarks`, {
			params: {
				page,
				limit,
			},
		});
		console.log("bookmarks for page " + page + ":");

		return response?.data?.data; // Array of bookmarks for the requested page
	} catch (error) {
		console.error("Error fetching bookmarks:", error);
		throw error;
	} finally {
		if (setShowLoading) setShowLoading(false);
	}
};
