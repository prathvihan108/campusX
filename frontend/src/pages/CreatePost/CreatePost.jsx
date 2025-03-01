import { useState } from "react";

const categories = [
	"general",
	"exams",
	"placements",
	"competitions",
	"hackathons",
	"lost_found",
];

const CreatePostForm = ({ onSubmit }) => {
	const [content, setContent] = useState("");
	const [category, setCategory] = useState("");
	const [image, setImage] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("content", content);
		formData.append("category", category);
		if (image) formData.append("image", image);

		onSubmit(formData);
	};

	return (
		<div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-lg mx-auto">
			<h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
				Create a Post
			</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<textarea
					placeholder="What's on your mind?"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
					required
				/>
				<select
					onChange={(e) => setCategory(e.target.value)}
					required
					className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
				>
					<option value="" disabled>
						Select Category
					</option>
					{categories.map((cat) => (
						<option key={cat} value={cat}>
							{cat.replace("_", " ").toUpperCase()}
						</option>
					))}
				</select>
				<input
					type="file"
					accept="image/*"
					onChange={(e) => setImage(e.target.files[0])}
					className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
				/>
				<button
					type="submit"
					className="w-full bg-blue-600 text-white p-2 rounded-lg dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
				>
					Create Post
				</button>
			</form>
		</div>
	);
};

export default CreatePostForm;
