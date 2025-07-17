import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	getUserChannelProfile,
	updateProfilePhoto,
	deleteAccount,
} from "../../services/userServices";

const UserProfile = () => {
	const { userName } = useParams();
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const fileInputRef = useRef(null);
	const navigate = useNavigate();

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

		if (userName) {
			fetchProfile();
		}
	}, [userName]);

	if (loading) {
		return (
			<p className="text-center text-gray-500 mt-10">Loading profile...</p>
		);
	}

	if (!profile) {
		return <p className="text-center text-red-500 mt-10">Profile not found</p>;
	}

	return (
		<div className="max-w-5xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
			{/* Cover Image */}
			{profile.coverImage && (
				<div className="h-56 md:h-64 w-full rounded-xl overflow-hidden">
					<img
						src={profile.coverImage}
						alt="Cover"
						className="object-cover w-full h-full"
					/>
				</div>
			)}

			{/* Avatar and Info */}
			<div className="flex flex-col md:flex-row items-center md:items-end gap-6 mt-6">
				<div>
					<img
						src={profile.avatar}
						alt="Avatar"
						className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-md"
					/>
				</div>

				<div className="text-center md:text-left">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						{profile.fullName}
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-400">
						username:@{profile.userName}
					</p>
					<p className="text-lg text-gray-600 dark:text-gray-400">
						Email:{profile.email}
					</p>
					<p className="text-md text-gray-500 dark:text-gray-300">
						{profile.department} - {profile.year}
					</p>
					<p className="text-md text-gray-500 dark:text-gray-300">
						Designation:{profile.role}
					</p>
				</div>
			</div>

			{/* Stats */}
			<div className="flex flex-wrap gap-10 mt-8 text-gray-700 dark:text-gray-300 text-lg">
				<div>
					<span className="font-semibold">{profile.subscribersCount}</span>{" "}
					Subscribers
				</div>
				<div>
					<span className="font-semibold">{profile.channelsSubscribedTo}</span>{" "}
					Subscribed
				</div>
				{profile.isSubscribed && (
					<div className="text-green-600 font-medium">✔ You are subscribed</div>
				)}
			</div>

			{/* Bio */}
			<div className="mt-6">
				<p className="text-base font-semibold text-gray-600 dark:text-gray-300 mb-2">
					Bio:
				</p>
				<div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-sm">
					<p className="text-lg text-gray-800 dark:text-gray-100 leading-relaxed">
						{profile.bio}
					</p>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
