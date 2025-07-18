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

export const fetchMyFollowers = async () => {
	try {
		const response = await axiosInstance.get(`/followers/me`);
		return response.data?.data;
	} catch (error) {
		console.error("Error fetching followers:", error);
		throw error;
	}
};
