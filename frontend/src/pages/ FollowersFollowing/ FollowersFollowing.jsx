import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
	fetchMyFollowers,
	fetchMyFollowing,
} from "../../services/followersServices.jsx";
import { useNavigate } from "react-router-dom";

function UserCard({ user }) {
	const navigate = useNavigate();
	const { fetchUser } = useAuth();

	useEffect(() => {
		fetchUser();
	}, []);

	const handleCardClick = () => {
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
	const [followersPage, setFollowersPage] = useState(1);
	const [followingPage, setFollowingPage] = useState(1);
	const [hasMoreFollowers, setHasMoreFollowers] = useState(true);
	const [hasMoreFollowing, setHasMoreFollowing] = useState(true);
	const [activeTab, setActiveTab] = useState("followers");
	const PAGE_LIMIT = 5;
	const { setShowLoading } = useAuth();

	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				setLoadingFollowers(true);
				setLoadingFollowing(true);

				const followersData = await fetchMyFollowers(1, PAGE_LIMIT);
				const followingData = await fetchMyFollowing(1, PAGE_LIMIT);

				setFollowers(followersData.followers || []);
				setHasMoreFollowers(
					(followersData.followers?.length || 0) === PAGE_LIMIT
				);

				setFollowing(followingData.following || []);
				setHasMoreFollowing(
					(followingData.following?.length || 0) === PAGE_LIMIT
				);
			} catch (error) {
				console.error("Failed to fetch initial followers/following:", error);
			} finally {
				setLoadingFollowers(false);
				setLoadingFollowing(false);
			}
		};

		fetchInitialData();
	}, []);

	useEffect(() => {
		const getFollowersData = async (page) => {
			try {
				setLoadingFollowers(true);
				const data = await fetchMyFollowers(page, PAGE_LIMIT);
				setFollowers((prev) =>
					page === 1
						? data.followers || []
						: [...prev, ...(data.followers || [])]
				);
				setHasMoreFollowers((data.followers?.length || 0) === PAGE_LIMIT);
			} catch (error) {
				console.error("Failed to fetch followers:", error);
			} finally {
				setLoadingFollowers(false);
			}
		};

		const getFollowingData = async (page) => {
			try {
				setLoadingFollowing(true);
				const data = await fetchMyFollowing(page, PAGE_LIMIT);
				setFollowing((prev) =>
					page === 1
						? data.following || []
						: [...prev, ...(data.following || [])]
				);
				setHasMoreFollowing((data.following?.length || 0) === PAGE_LIMIT);
			} catch (error) {
				console.error("Failed to fetch following:", error);
			} finally {
				setLoadingFollowing(false);
			}
		};

		if (activeTab === "followers") {
			getFollowersData(followersPage);
		} else {
			getFollowingData(followingPage);
		}
	}, [activeTab, followersPage, followingPage]);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop =
				window.pageYOffset || document.documentElement.scrollTop;
			const windowHeight = window.innerHeight;
			const fullHeight = document.documentElement.offsetHeight;

			if (
				scrollTop + windowHeight >= fullHeight - 200 &&
				!loadingFollowers &&
				!loadingFollowing
			) {
				if (activeTab === "followers" && hasMoreFollowers) {
					setFollowersPage((p) => p + 1);
				} else if (activeTab === "following" && hasMoreFollowing) {
					setFollowingPage((p) => p + 1);
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [
		activeTab,
		hasMoreFollowers,
		hasMoreFollowing,
		loadingFollowers,
		loadingFollowing,
	]);

	// Reset page & data on tab change
	useEffect(() => {
		if (activeTab === "followers") {
			setFollowersPage(1);
			setFollowers([]);
			setHasMoreFollowers(true);
		} else {
			setFollowingPage(1);
			setFollowing([]);
			setHasMoreFollowing(true);
		}
	}, [activeTab]);

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
					{loadingFollowers && followers.length === 0 ? (
						<p className="text-gray-400 text-center py-10">
							Loading followers...
						</p>
					) : followers.length === 0 ? (
						<EmptyState message="No followers found" />
					) : (
						<>
							<div className="space-y-4">
								{followers.map((item) => (
									<UserCard key={item._id} user={item.subscriber} />
								))}
							</div>
							{loadingFollowers && (
								<p className="text-center text-gray-400 py-4">
									Loading more followers...
								</p>
							)}
							{!hasMoreFollowers && (
								<p className="text-center text-gray-400 py-4">
									No more followers to load.
								</p>
							)}
						</>
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
					{loadingFollowing && following.length === 0 ? (
						<p className="text-gray-400 text-center py-10">
							Loading following...
						</p>
					) : following.length === 0 ? (
						<EmptyState message="Not following anyone yet" />
					) : (
						<>
							<div className="space-y-4">
								{following.map((item) => (
									<UserCard key={item._id} user={item.channel} />
								))}
							</div>
							{loadingFollowing && (
								<p className="text-center text-gray-400 py-4">
									Loading more following...
								</p>
							)}
							{!hasMoreFollowing && (
								<p className="text-center text-gray-400 py-4">
									No more following to load.
								</p>
							)}
						</>
					)}
				</section>
			)}
		</div>
	);
}

export default FollowersFollowing;
