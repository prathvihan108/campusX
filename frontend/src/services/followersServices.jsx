import axiosInstance from "../utils/axiosInstance";

export const handleFollow = async (userId) => {
	try {
		const response = await axiosInstance.post(`/users/${userId}/follow/`, {});

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
		const response = await axiosInstance.post(`/users/${userId}/unfollow/`, {});

		console.log(response?.data?.message);

		return response.data;
	} catch (error) {
		console.error("Error unfollowing user:", error);
		throw error;
	}
};
