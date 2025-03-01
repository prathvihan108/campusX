import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
const categories = [
	"general",
	"exams",
	"placements",
	"competitions",
	"hackathons",
	"lost_found",
];

const CreatePostForm = () => {
	const { setShowCreatePost, handleCreatePost } = useAuth();
	const [formData, setFormData] = useState({
		content: "",
		category: "",
		image: null,
	});

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: files ? files[0] : value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (Object.values(formData).some((value) => !value)) {
			alert("All fields are required!");
			return;
		}

		// Create FormData object
		const data = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			data.append(key, value);
		});

		// Debugging: Check FormData contents
		for (let pair of data.entries()) {
			console.log(pair[0], pair[1]);
		}

		// Call API function
		handleCreatePost(data);
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
			<div className="bg-white p-8 shadow-lg rounded-lg w-96 relative">
				<button
					onClick={() => setShowCreatePost(false)}
					className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
				>
					✖
				</button>
				<h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
					Create Post
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-600">
							Content
						</label>
						<textarea
							name="content"
							placeholder="What's on your mind?"
							value={formData.content}
							onChange={handleChange}
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-600">
							Category
						</label>
						<select
							name="category"
							value={formData.category}
							onChange={handleChange}
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
							required
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
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-600">
							Image
						</label>
						<input
							type="file"
							name="image"
							accept="image/*"
							onChange={handleChange}
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
					>
						Create Post
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreatePostForm;
