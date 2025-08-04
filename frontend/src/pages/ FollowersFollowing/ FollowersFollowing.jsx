import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { fetchMyFollowers } from "../../services/followersServices.jsx";
import { fetchMyFollowing } from "../../services/followersServices.jsx";
function UserCard({ user }) {
	const navigate = useNavigate();

	const { fetchUser } = useAuth();

	useEffect(() => {
		fetchUser();
	}, []);

	const handleCardClick = () => {
		console.log("selected userName:", user);
		navigate(`/users/channel/${user.userName}?id=${user._id}`);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleCardClick();
		}
	};
	return (
		<div
			className="bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-2xl p-5 shadow-lg hover:shadow-xl transition flex items-center gap-5 cursor-pointer"
			role="listitem"
			tabIndex={0}
			aria-label={`User: ${user.fullName}`}
			onClick={handleCardClick}
			onKeyDown={handleKeyDown}
		>
			<img
				src={user.avatar || "/avatar-placeholder.png"}
				alt={user.fullName}
				onError={(e) => {
					e.currentTarget.src = "/avatar-placeholder.png";
				}}
				className="w-16 h-16 rounded-full border-2 border-gray-600 object-cover shadow"
				loading="lazy"
			/>
			<div className="flex flex-col justify-center w-full">
				<div className="flex items-center gap-2">
					<p className="font-semibold text-white text-lg">{user.fullName}</p>
					<span className="ml-2 px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs font-medium">
						{user.role}
					</span>
					<span className="px-2 py-0.5 bg-blue-700/80 text-blue-100 rounded-full text-xs font-medium">
						{user.year}
					</span>
				</div>
				<p className="text-sm text-gray-400 mb-1">{user.email}</p>
				<p className="text-xs text-gray-500 mb-2">{user.department}</p>
				{user.bio && (
					<div className="mt-2 bg-gray-800/80 border-l-4 border-blue-500 p-3 rounded-lg text-gray-300 leading-relaxed text-sm shadow-inner">
						{user.bio}
					</div>
				)}
			</div>
		</div>
	);
}

function EmptyState({ message }) {
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
			<p className="text-lg font-medium">{message}</p>
		</div>
	);
}

function FollowersFollowing() {
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);
	const [loadingFollowers, setLoadingFollowers] = useState(false);
	const [loadingFollowing, setLoadingFollowing] = useState(false);
	const [activeTab, setActiveTab] = useState("followers"); // or "following"
	const { setShowLoading } = useAuth();

	useEffect(() => {
		const getFollowersData = async () => {
			try {
				setLoadingFollowers(true);
				const data = await fetchMyFollowers();
				setFollowers(data || []);
			} catch (error) {
				console.error("Failed to fetch followers:", error);
			} finally {
				setLoadingFollowers(false);
			}
		};

		const getFollowingData = async () => {
			try {
				setLoadingFollowing(true);
				const data = await fetchMyFollowing();
				setFollowing(data || []);
			} catch (error) {
				console.error("Failed to fetch following:", error);
			} finally {
				setLoadingFollowing(false);
			}
		};

		getFollowersData();
		getFollowingData();
	}, []);

	return (
		<div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
			<h1 className="text-3xl font-bold mb-8 text-center sm:text-left text-white">
				Connections
			</h1>

			{/* Tabs */}
			<div className="flex justify-center sm:justify-start mb-6 border-b border-gray-700">
				<button
					className={`px-6 py-2 -mb-px font-semibold border-b-2 transition ${
						activeTab === "followers"
							? "border-indigo-500 text-indigo-400"
							: "border-transparent hover:text-indigo-300 text-gray-400"
					}`}
					onClick={() => setActiveTab("followers")}
					aria-selected={activeTab === "followers"}
					role="tab"
					id="tab-followers"
					aria-controls="panel-followers"
				>
					Followers ({followers.length})
				</button>
				<button
					className={`ml-6 px-6 py-2 -mb-px font-semibold border-b-2 transition ${
						activeTab === "following"
							? "border-indigo-500 text-indigo-400"
							: "border-transparent hover:text-indigo-300 text-gray-400"
					}`}
					onClick={() => setActiveTab("following")}
					aria-selected={activeTab === "following"}
					role="tab"
					id="tab-following"
					aria-controls="panel-following"
				>
					Following ({following.length})
				</button>
			</div>

			{/* Tab Panels */}
			{activeTab === "followers" && (
				<section
					id="panel-followers"
					role="tabpanel"
					aria-labelledby="tab-followers"
					tabIndex={0}
				>
					{loadingFollowers ? (
						<p className="text-gray-400 text-center py-10">
							Loading followers...
						</p>
					) : followers.length === 0 ? (
						<EmptyState message="No followers found" />
					) : (
						<div className="space-y-4">
							{followers.map((item) => (
								<UserCard key={item._id} user={item.subscriber} />
							))}
						</div>
					)}
				</section>
			)}

			{activeTab === "following" && (
				<section
					id="panel-following"
					role="tabpanel"
					aria-labelledby="tab-following"
					tabIndex={0}
					className="mt-6"
				>
					{loadingFollowing ? (
						<p className="text-gray-400 text-center py-10">
							Loading following...
						</p>
					) : following.length === 0 ? (
						<EmptyState message="Not following anyone yet" />
					) : (
						<div className="space-y-4">
							{following.map((item) => (
								<UserCard key={item._id} user={item.channel} />
							))}
						</div>
					)}
				</section>
			)}
		</div>
	);
}

export default FollowersFollowing;
