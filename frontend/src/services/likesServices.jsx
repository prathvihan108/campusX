import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const toggleLike = async (postId) => {
	try {
		const response = await axios.post(
			`${apiUrl}/likes/${postId}/like/`,
			{},
			{ withCredentials: true }
		);

		console.log(response?.data?.message);
	} catch (error) {
		console.error("Error Liking post:", error);
		throw error;
	}
};
