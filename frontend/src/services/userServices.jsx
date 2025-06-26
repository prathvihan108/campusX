import axiosInstance from "../utils/axiosInstance";

// Fetch comments for a post
export const getUserChannelProfile = async (userName) => {
	try {
		console.log("making request..");
		const res = await axiosInstance.get(`/users/channel/${userName}`);
		console.log("fetched request.");
		return res.data.data;
	} catch (err) {
		console.error("Error fetching user channel profile:", err);
		throw err;
	}
};

// PATCH /update-avatar
export const updateProfilePhoto = async (formData) => {
	const res = await axiosInstance.patch("/users/update-avatar", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return { avatar: formData.get("avatarPreviewUrl") || null };
};

// DELETE /delete-account
export const deleteAccount = async () => {
	const res = await axiosInstance.delete("/users/delete-account");
	return res.data;
};
