import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { fetchMyFollowers } from "../../services/followersServices";

function Followers() {
	const [followers, setFollowers] = useState([]);
	const { setShowLoading } = useAuth();

	useEffect(() => {
		const getFollowersData = async () => {
			try {
				const data = await fetchMyFollowers(setShowLoading);
				setFollowers(data || []);
				console.log("Followers:", data);
			} catch (error) {
				console.error("Failed to fetch followers:", error);
			}
		};

		getFollowersData();
	}, []);

	if (followers.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center mt-16 text-gray-600 dark:text-gray-400">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-12 w-12 mb-4 text-gray-400 dark:text-gray-500"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={1.5}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M17 20h5v-2a4 4 0 00-4-4h-1M7 20h5v-2a4 4 0 00-4-4H7m4-4a4 4 0 11-8 0 4 4 0 018 0zm10 0a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
				<p className="text-lg font-medium">No followers found</p>
				<p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
					Looks like no one is following this profile yet.
				</p>
			</div>
		);
	}

	return (
		<div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
			<h1 className="text-2xl font-semibold mb-6 text-center text-white">
				Your Followers
			</h1>

			<div className="space-y-4">
				{followers.map((item) => {
					const follower = item.subscriber;

					return (
						<div
							key={item._id}
							className="bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl p-4 shadow-md hover:shadow-lg transition flex items-center"
						>
							<img
								src={follower.avatar}
								alt={follower.fullName}
								className="w-12 h-12 rounded-full mr-4 border-2 border-white"
							/>
							<div>
								<p className="font-semibold text-white">{follower.fullName}</p>
								<p className="text-sm text-gray-300">{follower.email}</p>
								<p className="text-sm text-gray-400">
									{follower.role}, {follower.department} – {follower.year}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Followers;
