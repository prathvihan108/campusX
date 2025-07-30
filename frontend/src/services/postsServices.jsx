import axiosInstance from "../utils/axiosInstance";

export const getPostsByUserId = async (userId) => {
	try {
		const response = await axiosInstance.get(`/posts/user/${userId}`);
		return response.data?.data || [];
	} catch (error) {
		console.error("Error fetching posts by user:", error);
		throw error;
	}
};

export const fetchPosts = async ({
	pageToLoad,
	currentUserId,
	setPosts,
	setLoading,
	setHasMore,
	loading,
}) => {
	if (loading) return; // prevent concurrent calls
	setLoading(true);
	try {
		const limit = 10;

		const response = await axiosInstance.get("/api/posts", {
			params: {
				userId: currentUserId,
				page: pageToLoad,
				limit,
			},
		});

		const newPosts = response.data.data || [];

		setPosts((prevPosts) => [...prevPosts, ...newPosts]);

		if (newPosts.length < limit) {
			setHasMore(false);
		}
	} catch (error) {
		console.error("Error fetching posts:", error);
	} finally {
		setLoading(false);
	}
};
