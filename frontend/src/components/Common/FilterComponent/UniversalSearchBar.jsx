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
		<div className="p-4 w-full max-w-md mx-auto">
			<label className="block text-sm font-semibold mb-2" htmlFor="search">
				Search Tweets or Users (username/full name)
			</label>
			<input
				id="search"
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Type username or name…"
				className="w-full p-2 border border-gray-300 rounded-lg"
			/>
			<button
				onClick={handleSearch}
				className="mt-3 w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
				type="button"
			>
				Search
			</button>
		</div>
	);
}
