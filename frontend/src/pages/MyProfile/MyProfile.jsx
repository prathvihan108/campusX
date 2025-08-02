import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	getUserChannelProfile,
	updateProfilePhoto,
	deleteAccount,
} from "../../services/userServices";

const MyProfile = () => {
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
		if (userName) fetchProfile();
	}, [userName]);

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("avatar", file);

		try {
			const updated = await updateProfilePhoto(formData);
			setProfile((prev) => ({ ...prev, avatar: updated.avatar }));
		} catch (err) {
			console.error("Failed to update avatar", err);
		}
	};

	const handleDeleteAccount = async () => {
		const confirmed = window.confirm(
			"Are you sure you want to delete your account?"
		);
		if (!confirmed) return;

		try {
			await deleteAccount();
			alert("Account deleted");
			navigate("/");
		} catch (err) {
			console.error("Failed to delete account", err);
			alert("Something went wrong while deleting account.");
		}
	};

	if (loading)
		return (
			<p className="text-center text-gray-500 mt-10">Loading profile...</p>
		);
	if (!profile)
		return <p className="text-center text-red-500 mt-10">Profile not found</p>;

	return (
		<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 max-w-4xl mx-auto">
			{/* Avatar and Info */}
			<div className="flex flex-col md:flex-row items-center md:items-start gap-8">
				{/* Editable Avatar */}
				<div
					className="relative group cursor-pointer flex-shrink-0"
					onClick={handleAvatarClick}
				>
					<img
						src={profile.avatar}
						alt="Avatar"
						className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white dark:border-gray-900 shadow-md object-cover transition duration-300 ease-in-out group-hover:brightness-75"
					/>
					<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-sm text-center py-1 rounded-b-full opacity-0 group-hover:opacity-100 transition">
						Edit Photo
					</div>
					<input
						type="file"
						ref={fileInputRef}
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
					/>
				</div>

				{/* User Info */}
				<div className="flex-1 text-center md:text-left">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white">
						{profile.fullName}
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-400 italic mb-1">
						@{profile.userName}
					</p>

					<div className="text-base text-gray-700 dark:text-gray-300 space-y-1">
						<p>
							Email: <span className="font-medium">{profile.email}</span>
						</p>
						<p>
							{profile.department} - {profile.year}
						</p>
						<p>
							Designation: <span className="font-medium">{profile.role}</span>
						</p>
					</div>
				</div>
			</div>

			{/* Stats */}
			<div className="flex flex-wrap gap-12 mt-8 text-gray-700 dark:text-gray-300 text-lg font-semibold justify-center md:justify-start">
				<div>
					<span className="text-2xl">{profile.subscribersCount}</span>{" "}
					Subscribers
				</div>
				<div>
					<span className="text-2xl">{profile.channelsSubscribedTo}</span>{" "}
					Subscribed
				</div>
				{profile.isSubscribed && (
					<div className="text-green-600 font-medium flex items-center">
						✔ You are subscribed
					</div>
				)}
			</div>

			{/* Email - repeated here for mobile visibility */}
			<div className="mt-6 text-center text-gray-600 dark:text-gray-400 md:hidden">
				Email: <span className="font-medium">{profile.email}</span>
			</div>

			{/* Delete Account Button */}
			<div className="mt-10 text-center">
				<button
					onClick={handleDeleteAccount}
					className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-xl transition font-semibold"
				>
					Delete My Account
				</button>
			</div>
		</div>
	);
};

export default MyProfile;
