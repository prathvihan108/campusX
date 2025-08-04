import axiosInstance from "../utils/axiosInstance";

export const handleFollow = async (userId) => {
	try {
		const response = await axiosInstance.post(
			`/followers/${userId}/follow/`,
			{}
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
		const response = await axiosInstance.post(
			`/followers/${userId}/unfollow/`,
			{}
		);

		console.log(response?.data?.message);

		return response.data;
	} catch (error) {
		console.error("Error unfollowing user:", error);
		throw error;
	}
};

export const checkIsFollowing = async (userId) => {
	try {
		const response = await axiosInstance.get(
			`/followers/${userId}/is-following`
		);
		return response.data?.data?.isFollowing;
	} catch (error) {
		console.error("Error checking follow status:", error);
		throw error;
	}
};

export const fetchMyFollowers = async (page = 1, limit = 5) => {
	try {
		const response = await axiosInstance.get(
			`/followers/me?page=${page}&limit=${limit}`
		);
		return response.data?.data;
	} catch (error) {
		console.error("Error fetching followers:", error);
		throw error;
	}
};

export const fetchMyFollowing = async (page = 1, limit = 5) => {
	try {
		const response = await axiosInstance.get(
			`/followers/meFollowing?page=${page}&limit=${limit}`
		);
		return response.data?.data;
	} catch (error) {
		console.error("Error fetching following users:", error);
		throw error;
	}
};
