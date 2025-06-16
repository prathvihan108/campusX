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
export const fetchBookmarks = async (setShowLoading) => {
	try {
		if (setShowLoading) setShowLoading(true);

		const response = await axiosInstance.get(`/bookmarks`);
		console.log("status code: " + response?.data?.statusCode);
		console.log("message: " + response?.data?.message);
		console.log("posts: ", response?.data?.data);

		return response?.data?.data;
	} catch (error) {
		console.error("Error fetching bookmarks:", error);
		throw error;
	} finally {
		if (setShowLoading) setShowLoading(false);
	}
};
