import axiosInstance from "../utils/axiosInstance";

// Fetch comments for a post
export const getComments = async (postId) => {
	const response = await axiosInstance.get(`/comments/${postId}`);
	return response.data.data; // assuming ApiResponse wrapper
};

// Add a new comment
export const addComment = async (postId, text) => {
	const response = await axiosInstance.post(`/comments/${postId}`, { text });
	return response.data.data;
};

//  Delete a comment
export const deleteComment = async (commentId) => {
	const response = await axiosInstance.delete(`/comments/${commentId}`);
	return response.data.data;
};
