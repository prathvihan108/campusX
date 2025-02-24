import { useState } from "react";

export default function HashtagSelector() {
	const tags = [
		"General",
		"Exams",
		"Placements",
		"Hackathons",
		"Competitions",
		"Lost & Found",
	];
	const [selectedTag, setSelectedTag] = useState("General");

	return (
		<div className="flex flex-col items-center p-4 space-y-4">
			<div className="flex space-x-2">
				{tags.map((tag) => (
					<button
						key={tag}
						className={`px-4 py-2 rounded-lg border ${
							selectedTag === tag ? "bg-blue-500 text-white" : "bg-gray-200"
						}`}
						onClick={() => setSelectedTag(tag)}
					>
						#{tag}
					</button>
				))}
			</div>
			<div className="p-4 border rounded-lg w-64 text-center text-lg font-semibold bg-gray-100">
				{selectedTag}
			</div>
		</div>
	);
}
