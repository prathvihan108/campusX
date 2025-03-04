//not used currently
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
export const fetchAllPosts = async () => {
	try {
		const response = await axios.get(apiUrl + "posts/");
		return response.data;
	} catch (error) {
		console.error("Error fetching posts:", error);
		throw error;
	}
};
