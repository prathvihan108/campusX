import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
	const tabs = [
		{ id: "home", label: "Home", path: "/" },
		{ id: "followers", label: "My Circle", path: "/followers" },
		{ id: "bookmarks", label: "Bookmarks", path: "/bookmarks" },
		{ id: "notifications", label: "Notifications", path: "/notifications" },
	];

	return (
		<footer className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md p-3 pb-6">
			<nav className="flex justify-around">
				{tabs.map((tab) => (
					<NavLink
						key={tab.id}
						to={tab.path}
						className={({ isActive }) =>
							`relative flex flex-col items-center space-y-1 font-semibold text-lg w-full transition-all ${
								isActive ? "text-blue-600" : "text-gray-400"
							}`
						}
						end={tab.path === "/"}
					>
						<span className="text-sm w-full text-center">{tab.label}</span>

						{({ isActive }) => (
							<div
								className={`absolute bottom-0 left-0 w-full h-1 rounded-full transition-all ${
									isActive ? "bg-blue-600" : "bg-transparent"
								}`}
							></div>
						)}
					</NavLink>
				))}
			</nav>
		</footer>
	);
};

export default Footer;
