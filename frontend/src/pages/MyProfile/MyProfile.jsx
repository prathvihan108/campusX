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

		if (userName) {
			fetchProfile();
		}
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
			navigate("/"); // redirect to homepage or login
		} catch (err) {
			console.error("Failed to delete account", err);
			alert("Something went wrong while deleting account.");
		}
	};

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
				<div
					className="relative group cursor-pointer"
					onClick={handleAvatarClick}
				>
					<img
						src={profile.avatar}
						alt="Avatar"
						className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-md transition hover:brightness-75"
					/>
					<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm text-center py-1 opacity-0 group-hover:opacity-100 transition">
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

				<div className="text-center md:text-left">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						{profile.fullName}
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-400">
						@{profile.userName}
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

			{/* Email */}
			<div className="mt-6">
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Email:{" "}
					<span className="text-gray-700 dark:text-gray-200">
						{profile.email}
					</span>
				</p>
			</div>

			{/* Delete Button */}
			<div className="mt-10 text-center">
				<button
					onClick={handleDeleteAccount}
					className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl transition font-semibold"
				>
					Delete My Account
				</button>
			</div>
		</div>
	);
};

export default MyProfile;
