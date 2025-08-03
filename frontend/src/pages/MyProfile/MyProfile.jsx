import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import {
	getUserChannelProfile,
	updateProfilePhoto,
	deleteAccount,
	updateBio as updateBioService,
} from "../../services/userServices";

const MyProfile = () => {
	const { userName } = useParams();
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [bio, setBio] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const fileInputRef = useRef(null);
	const navigate = useNavigate();
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const pickerRef = useRef(null);

	// Close emoji picker when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (pickerRef.current && !pickerRef.current.contains(event.target)) {
				setShowEmojiPicker(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const onEmojiClick = (emojiData, event) => {
		setBio((prev) => prev + emojiData.emoji);
		setHasChanges(true);
	};

	useEffect(() => {
		if (profile?.bio !== undefined && profile?.bio !== null) {
			setBio(profile.bio);
		} else {
			setBio("");
		}
	}, [profile]);

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

	const handleChange = (e) => {
		setBio(e.target.value);
		setHasChanges(true);
	};

	const handleSave = async () => {
		setLoading(true);
		try {
			await updateBioService(bio);
			setProfile((prev) => ({ ...prev, bio })); // Update UI immediately
			setHasChanges(false);
			setIsEditing(false);
		} catch (error) {
			alert("Failed to save bio. Please try again.");
		}
		setLoading(false);
	};

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
			<p className="text-center text-gray-500 mt-10 animate-pulse">
				Loading profile...
			</p>
		);
	if (!profile)
		return <p className="text-center text-red-500 mt-10">Profile not found</p>;

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg transition-colors duration-300">
			{/* Avatar and Name Section */}
			<div className="flex flex-col md:flex-row items-center md:items-start gap-6">
				<div className="relative group">
					<img
						src={profile.avatar || "/default-avatar.png"}
						alt={`${profile.fullName} avatar`}
						className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 transition-shadow duration-300"
					/>
					<button
						onClick={handleAvatarClick}
						aria-label="Change profile photo"
						className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 shadow-md hover:bg-blue-700"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path d="M4 5a2 2 0 012-2h3.586A1 1 0 0110 3.414L11.586 5H14a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
							<path d="M8 9a3 3 0 100 6 3 3 0 000-6z" />
						</svg>
					</button>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleFileChange}
					/>
				</div>

				<div className="flex-1 space-y-1 text-center md:text-left">
					<h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
						{profile.fullName}
					</h1>
					<p className="text-lg text-blue-600 dark:text-blue-400 font-semibold italic">
						@{profile.userName}
					</p>
					<div className="text-gray-700 dark:text-gray-300 mt-3 space-y-1 text-sm md:text-base">
						<p>
							Email:{" "}
							<span className="font-medium text-gray-900 dark:text-white">
								{profile.email}
							</span>
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

			{/* Bio Section */}
			{/* Bio Section */}
			<div className="mt-8 relative">
				<label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
					Bio
				</label>
				{isEditing ? (
					<>
						<textarea
							className="w-full p-3 border-2 border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-300"
							rows={4}
							value={bio}
							onChange={handleChange}
							placeholder="Tell us about yourself..."
						/>
						<div className="flex items-center gap-3 mt-2">
							<button
								type="button"
								onClick={() => setShowEmojiPicker((val) => !val)}
								className="text-2xl px-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
								aria-label="Toggle emoji picker"
								title="Add emoji"
							>
								😊
							</button>
							{showEmojiPicker && (
								<div className="absolute z-50 mt-10" ref={pickerRef}>
									<EmojiPicker
										onEmojiClick={onEmojiClick}
										theme={
											localStorage.getItem("theme") === "dark"
												? "dark"
												: "light"
										}
									/>
								</div>
							)}

							<button
								disabled={loading}
								onClick={handleSave}
								className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
							>
								{loading ? "Saving..." : "Save"}
							</button>
							<button
								onClick={() => {
									setBio(profile?.bio || "");
									setHasChanges(false);
									setIsEditing(false);
									setShowEmojiPicker(false);
								}}
								className="px-5 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition"
							>
								Cancel
							</button>
						</div>
					</>
				) : (
					<p
						onClick={() => setIsEditing(true)}
						className={`cursor-pointer min-h-[5rem] p-4 border-2 rounded-lg border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300 ${
							bio
								? "whitespace-pre-wrap"
								: "italic text-gray-400 dark:text-gray-500"
						}`}
						title="Click to edit bio"
					>
						{bio || "Click to add a bio"}
					</p>
				)}
			</div>

			{/* Footer actions */}
			<div className="mt-10 flex justify-end gap-4">
				<button
					onClick={handleDeleteAccount}
					className="px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
					title="Delete your account"
				>
					Delete Account
				</button>
			</div>
		</div>
	);
};

export default MyProfile;
