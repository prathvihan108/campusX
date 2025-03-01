import React, { useState } from "react";
import CreatePostForm from "../../Posts/CreatePost.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

const CreatePostButton = () => {
	const { showCreatePost, setShowCreatePost } = useAuth();

	return (
		<div>
			<div className="relative">
				<button
					onClick={() => setShowCreatePost(true)}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Create Post
				</button>
				{showCreatePost && <CreatePostForm />}
			</div>
		</div>
	);
};

export default CreatePostButton;
