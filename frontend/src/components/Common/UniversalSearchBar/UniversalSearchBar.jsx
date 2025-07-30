import { useState } from "react";

export default function UniversalSearchBar({ onSearch }) {
	const [query, setQuery] = useState("");

	const handleSearch = () => {
		const trimmed = query.trim();
		if (trimmed) {
			onSearch(trimmed); // Pass query to backend
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") handleSearch();
	};

	return (
		<>
			<div className="sticky top-6 z-20 bg-white bg-opacity-90 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg max-w-xl mx-auto px-4 py-3 flex items-center space-x-3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 text-gray-400 flex-shrink-0"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
					/>
				</svg>

				<input
					type="text"
					placeholder="Search by username or full name..."
					className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-700 text-base"
				/>
			</div>
		</>
	);
}
