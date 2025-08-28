import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import EmojiPicker from "emoji-picker-react";
import imageCompression from "browser-image-compression";

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
	const [showPicker, setShowPicker] = useState(false);
	const pickerRef = useRef(null);

	// const handleChange = (e) => {
	// 	const { name, value, files } = e.target;
	// 	setFormData((prev) => ({
	// 		...prev,
	// 		[name]: files ? files[0] : value,
	// 	}));
	// };

	const handleChange = async (e) => {
		const { name, files, value } = e.target;

		if (files && files[0]) {
			const file = files[0];

			console.log(
				"Original file size:",
				(file.size / 1024 / 1024).toFixed(2),
				"MB"
			);

			// Compression options
			const options = {
				maxSizeMB: 2, // target size ≤ 2MB
				maxWidthOrHeight: 1920, // scale down dimensions
				useWebWorker: true,
			};

			try {
				const compressedFile = await imageCompression(file, options);

				console.log(
					"Compressed file size:",
					(compressedFile.size / 1024 / 1024).toFixed(2),
					"MB"
				);

				setFormData((prev) => ({
					...prev,
					[name]: compressedFile, // save compressed file
				}));
			} catch (err) {
				console.error("Image compression error:", err);
			}
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const addEmoji = (emoji) => {
		setFormData((prev) => ({
			...prev,
			content: prev.content + emoji.emoji,
		}));
		setShowPicker(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.content || !formData.category) {
			alert("Content and category are required!");
			return;
		}

		const data = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			data.append(key, value);
		});

		handleCreatePost(data);
	};

	// Close emoji picker when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (pickerRef.current && !pickerRef.current.contains(event.target)) {
				setShowPicker(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

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
						<div className="relative">
							<textarea
								name="content"
								placeholder="What's on your mind?"
								value={formData.content}
								onChange={handleChange}
								className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPicker(!showPicker)}
								className="absolute right-2 top-2"
							>
								😀
							</button>
							{showPicker && (
								<div
									ref={pickerRef}
									className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-md rounded-lg p-2"
								>
									<EmojiPicker onEmojiClick={addEmoji} />
								</div>
							)}
						</div>
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
