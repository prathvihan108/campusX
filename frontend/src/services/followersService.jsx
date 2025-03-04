import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

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
			`${apiUrl}/users/${userId}/follow/`,
			{},
			{ withCredentials: true }
		);
		if (response.status == 400) {
			console.log("you can not folllo your self");
		}
		console.log(response?.data?.message);
		return response.data;
	} catch (error) {
		console.error("Error following user:", error);
		throw error;
	}
};

export const handleUnfollow = async (userId) => {
	try {
		const response = await axios.post(
			`${apiUrl}/users/${userId}/unfollow/`,
			{},
			{ withCredentials: true }
		);
		console.log(response?.data?.message);

		return response.data;
	} catch (error) {
		console.error("Error unfollowing user:", error);
		throw error;
	}
};
