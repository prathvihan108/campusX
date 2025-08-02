import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { getUserChannelProfile } from "../../services/userServices";
import { toast } from "react-toastify";
import {
	handleFollow,
	handleUnfollow,
	checkIsFollowing,
} from "../../services/followersServices";

const UserProfile = () => {
	const { userName } = useParams();
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();
	const currentUserId = user?._id;
	const [isFollowing, setIsFollowing] = useState(false);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const data = await getUserChannelProfile(userName);
				setProfile(data);
			} catch (error) {
				console.error("Error fetching profile:", error);
			} finally {
				setLoading(false);
			}
		};
		if (userName) fetchProfile();
	}, [userName]);

	useEffect(() => {
		const checkFollowingStatus = async () => {
			if (currentUserId && profile) {
				const followingStatus = await checkIsFollowing(profile._id);
				setIsFollowing(followingStatus);
			}
		};
		checkFollowingStatus();
	}, [currentUserId, profile]);

	const toggleFollow = async () => {
		if (!currentUserId) {
			toast.info("Please log in to follow users.", { autoClose: 1000 });
			return;
		}
		try {
			if (isFollowing) await handleUnfollow(profile._id);
			else await handleFollow(profile._id);
			setIsFollowing(!isFollowing);
		} catch (error) {
			console.error("Error updating follow status:", error);
		}
	};

	if (loading)
		return (
			<p className="text-center text-gray-500 mt-10">Loading profile...</p>
		);
	if (!profile)
		return <p className="text-center text-red-500 mt-10">Profile not found</p>;

	return (
		<div className="max-w-3xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 px-8 py-8">
			<div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
				{/* Profile Picture */}
				<img
					src={profile.avatar}
					alt="Avatar"
					className="w-36 h-36 rounded-full border-4 border-white dark:border-gray-900 shadow-xl object-cover"
				/>

				{/* User Info, Button, Stats, Bio in a vertical stack */}
				<div className="flex-1 w-full">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
								{profile.fullName}
							</h1>
							<p className="text-lg text-gray-500 dark:text-gray-400 italic mb-2">
								@{profile.userName}
							</p>
							<div className="text-base text-gray-600 dark:text-gray-300">
								<p>
									Email: <span className="font-medium">{profile.email}</span>
								</p>
								<p>
									{profile.department} - {profile.year}
								</p>
								<p>
									Designation:{" "}
									<span className="font-medium">{profile.role}</span>
								</p>
							</div>
						</div>
						{currentUserId !== profile._id && (
							<button
								onClick={toggleFollow}
								className={`mt-4 md:mt-0 px-8 py-2 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ${
									isFollowing
										? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
										: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
								} text-white whitespace-nowrap`}
							>
								{isFollowing ? "Unfollow" : "Follow"}
							</button>
						)}
					</div>
					<div className="flex gap-10 mt-5 text-gray-700 dark:text-gray-300 font-semibold text-md">
						<div>
							<span className="text-xl">{profile.subscribersCount}</span>{" "}
							Followers
						</div>
						<div>
							<span className="text-xl">{profile.channelsSubscribedTo}</span>{" "}
							Following
						</div>
					</div>
					<div className="mt-5">
						<p className="text-base font-semibold text-gray-600 dark:text-gray-300 mb-2">
							Bio
						</p>
						<div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-xl shadow-sm text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-line">
							{profile.bio}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
