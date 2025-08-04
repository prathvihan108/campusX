import axiosInstance from "../utils/axiosInstance";

export const getPostsByUserId = async (userId, page = 1, limit = 5) => {
	try {
		const response = await axiosInstance.get(`/posts/user/${userId}`, {
			params: { page, limit },
		});
		const posts = response.data?.data || [];

		posts.forEach((post, index) => {
			// If you want to print a specific field, for example `post.content`, do:
			console.log(`Post #${index + 1} content:`, post.content);
		});

		return response.data?.data || [];
	} catch (error) {
		console.error("Error fetching posts by user:", error);
		throw error;
	}
};

export const deletePostById = async (postId) => {
	try {
		const response = await axiosInstance.delete(`/posts/${postId}`);
		console.log(`Post with ID ${postId} deleted successfully.`);
		return response.data;
	} catch (error) {
		console.error(`Error deleting post with ID ${postId}:`, error);
		throw error;
	}
};
