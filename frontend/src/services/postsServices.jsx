import axiosInstance from "../utils/axiosInstance";

export const getPostsByUserId = async (userId) => {
	try {
		const response = await axiosInstance.get(`/posts/user/${userId}`);
		return response.data?.data || [];
	} catch (error) {
		console.error("Error fetching posts by user:", error);
		throw error;
	}
};
