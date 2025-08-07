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

export const updateBio = async (bio) => {
	try {
		const res = await axiosInstance.patch("/users/update-bio", { bio });
		return res.data;
	} catch (err) {
		console.error("Error updating bio:", err);
		throw err;
	}
};

//update profile

export const updateProfile = async (profileFields) => {
	try {
		const res = await axiosInstance.patch(
			"/users/update-account",
			profileFields
		);
		return res.data;
	} catch (err) {
		console.error("Error updating profile:", err);
		throw err;
	}
};

//Seach users by username or full name
// userService.js
export async function searchUsers(query) {
	try {
		const response = await axiosInstance.get("/users/search", {
			params: { query },
		});

		if (response.status !== 200) {
			throw new Error("Failed to fetch users");
		}

		// Assume your backend structure: { statusCode, data: usersArray, message }
		const users = response.data.data || [];

		return users;
	} catch (error) {
		console.error("Error searching users:", error);
		return [];
	}
}
