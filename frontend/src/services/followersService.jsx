import axios from "axios";

const API_BASE_URL = "/api/v1/users";

export const currentUser = async () => {
	try {
		const response = await axios.get(`${API_BASE_URL}/current-user`, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching current user:", error);
		return null;
	}
};

export const handleFollow = async (userId) => {
	try {
		const response = await axios.post(
			`${API_BASE_URL}/follow/${userId}`,
			{},
			{ withCredentials: true }
		);
		return response.data;
	} catch (error) {
		console.error("Error following user:", error);
		throw error;
	}
};

export const handleUnfollow = async (userId) => {
	try {
		const response = await axios.post(
			`${API_BASE_URL}/unfollow/${userId}`,
			{},
			{ withCredentials: true }
		);
		return response.data;
	} catch (error) {
		console.error("Error unfollowing user:", error);
		throw error;
	}
};
