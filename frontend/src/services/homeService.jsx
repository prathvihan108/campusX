import axios from "axios";

const API_URL = "http://localhost:8007/api/v1/posts/";

export const fetchAllPosts = async () => {
	try {
		const response = await axios.get(API_URL);
		return response.data;
	} catch (error) {
		console.error("Error fetching posts:", error);
		throw error;
	}
};
