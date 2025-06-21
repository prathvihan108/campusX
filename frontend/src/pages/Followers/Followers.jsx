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
			<p className="text-center mt-6 text-gray-500">No followers found.</p>
		);
	}

	return (
		<div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
			<h1 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
				Your Followers
			</h1>
			<div className="space-y-4">
				{followers.map((item) => {
					const follower = item.subscriber;

					return (
						<div
							key={item._id}
							className="border rounded-lg p-4 shadow hover:shadow-md transition bg-white flex items-center"
						>
							<img
								src={follower.avatar}
								alt={follower.fullName}
								className="w-12 h-12 rounded-full mr-4"
							/>
							<div>
								<p className="font-medium text-base">{follower.fullName}</p>
								<p className="text-sm text-gray-500">{follower.email}</p>
								<p className="text-sm text-gray-400">
									{follower.role}, {follower.department} - {follower.year}
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
