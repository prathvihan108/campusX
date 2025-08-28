import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import useDebounce from "../../../hooks/useDebounce.jsx";
import { toast } from "react-toastify";

export default function UniversalSearchBar({
	query,
	onQueryChange,
	onSearch,
	suggestions,

	onSuggestionSelect,
}) {
	const { user } = useAuth();
	const debouncedQuery = useDebounce(query, 600);

	useEffect(() => {
		if (debouncedQuery) {
			onSearch(debouncedQuery);
		}
	}, [debouncedQuery, onSearch]);

	const handleInputChange = (e) => {
		onQueryChange(e.target.value);
	};

	const onChangeHandler = (e) => {
		// if (!user) {
		// 	toast.info("Please log in to search", {
		// 		autoClose: 0,
		// 		position: "top-right",
		// 	});
		// 	// Prevent typing by not calling handleInputChange
		// 	return;
		// }
		handleInputChange(e);
	};

	return (
		<div className="relative max-w-md w-full mx-auto">
			{/* Search Icon */}
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5 text-gray-400"
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
			</div>

			{/* Input with left padding to make room for icon */}
			<input
				type="text"
				value={query}
				onChange={onChangeHandler}
				placeholder="Search by full name or username..."
				className="
			  w-full
			  pl-10  /* padding left for icon */
			  pr-4
			  py-3
			  rounded-lg
			  border
			  border-gray-300
			  focus:outline-none
			  focus:ring-2
			  focus:ring-blue-500
			  focus:border-transparent
			  text-gray-800
			  placeholder-gray-400
			  text-base
			  sm:text-lg
			  transition
			  duration-200
			  shadow-sm
			"
				aria-label="Search users"
			/>

			{suggestions.length > 0 && (
				<ul
					className="
				absolute
				z-50
				w-full
				mt-1
				max-h-64
				overflow-y-auto
				rounded-md
				border
				border-gray-300
				bg-white
				shadow-lg
				scrollbar-thin
				scrollbar-thumb-gray-300
				scrollbar-track-gray-100
				sm:text-base
				text-sm
			  "
					role="listbox"
				>
					{suggestions.map((user) => (
						<li
							key={user._id}
							onClick={() => onSuggestionSelect(user)}
							className="
					cursor-pointer
					px-4
					py-3
					hover:bg-blue-100
					focus:bg-blue-100
					focus:outline-none
					flex
					items-center
					space-x-3
					transition
					duration-150
					rounded-md
				  "
							role="option"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									onSuggestionSelect(user);
								}
							}}
						>
							<img
								src={user.avatar}
								alt={user.fullName}
								className="w-8 h-8 rounded-full"
							/>

							<div className="flex flex-col">
								<span className="font-medium text-gray-900">
									{user.fullName}
								</span>
								<span className="text-gray-500 text-sm">
									@{user.userName || user.username}
								</span>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
