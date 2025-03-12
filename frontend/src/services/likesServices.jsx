import axiosInstance from "../utils/axiosInstance";

export const toggleLike = async (postId) => {
	try {
		const response = await axiosInstance.post(`/likes/${postId}/like/`, {}); //same for like and unlike.

		console.log(response?.data?.message);
	} catch (error) {
		console.error("Error Liking post:", error);
		throw error;
	}
};
