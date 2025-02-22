import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
	const tabs = [
		{ id: "home", label: "Home", path: "/" },
		{ id: "placements", label: "Placements", path: "/placements" },
		{ id: "exams", label: "Exams", path: "/exams" },
		{ id: "hackathons", label: "Hackathons", path: "/hackathons" },
		{ id: "lostandfound", label: "Lost & Found", path: "/lostandfound" },
	];

	return (
		<footer className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4">
			<nav className="flex justify-around">
				{tabs.map((tab) => (
					<NavLink
						key={tab.id}
						to={tab.path}
						className={({ isActive }) =>
							`flex flex-col items-center space-y-1 ${
								isActive ? "text-blue-600" : "text-gray-500"
							}`
						}
						end={tab.path === "/"}
					>
						<span className="text-sm">{tab.label}</span>
						{({ isActive }) =>
							isActive && (
								<div className="h-1 w-full bg-blue-600 rounded-full"></div>
							)
						}
					</NavLink>
				))}
			</nav>
		</footer>
	);
};

export default Footer;
