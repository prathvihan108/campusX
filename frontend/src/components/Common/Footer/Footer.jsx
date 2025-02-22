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
		<footer className="fixed bottom-0 left-0 w-full  dark:bg-gray-800 shadow-md p-4 ">
			<nav className="flex justify-around">
				{tabs.map((tab) => (
					<NavLink
						key={tab.id}
						to={tab.path}
						className={({ isActive }) =>
							`relative flex flex-col items-center space-y-1 font-semibold text-xl w-full ${
								isActive ? "text-blue-600" : "text-gray-400"
							}`
						}
						end={tab.path === "/"}
					>
						{({ isActive }) => (
							<>
								<span className="text-sm w-full text-center">{tab.label}</span>
								{isActive && (
									<div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full"></div>
								)}
							</>
						)}
					</NavLink>
				))}
			</nav>
		</footer>
	);
};

export default Footer;
