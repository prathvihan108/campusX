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
		<div className="flex flex-col items-center p-3 sm:p-4 space-y-3 sm:space-y-4 w-full max-w-xs sm:max-w-md lg:max-w-lg mx-auto">
			<div className="flex flex-wrap justify-center gap-2 sm:gap-3">
				{tags.map((tag) => (
					<button
						key={tag}
						className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg border text-sm sm:text-base ${
							selectedTag === tag ? "bg-blue-500 text-white" : "bg-gray-200"
						}`}
						onClick={() => setSelectedTag(tag)}
					>
						#{tag}
					</button>
				))}
			</div>
		</div>
	);
}
