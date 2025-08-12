import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import {
	getUserChannelProfile,
	updateProfile,
	updateBio as updateBioService,
	updateProfilePhoto,
	deleteAccount,
} from "../../services/userServices";

const MyProfile = () => {
	const { userName } = useParams();
	const navigate = useNavigate();
	const fileInputRef = useRef(null);
	const pickerRef = useRef(null);

	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [deleteConfirmText, setDeleteConfirmText] = useState("");
	const confirmationPhrase = `delete my account with ${profile?.userName}`;

	// Editable fields state and control
	const [editableFields, setEditableFields] = useState({
		fullName: "",
		role: "",
		department: "",
		year: "",
	});
	const [isEditingFields, setIsEditingFields] = useState(false);
	const [fieldsChanged, setFieldsChanged] = useState(false);

	// Bio editing state
	const [bio, setBio] = useState("");
	const [isEditingBio, setIsEditingBio] = useState(false);
	const [bioChanged, setBioChanged] = useState(false);

	// Emoji picker
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	// Fetch profile when userName changes
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				setLoading(true);
				const data = await getUserChannelProfile(userName);
				setProfile(data || null);

				if (data) {
					setEditableFields({
						fullName: data.fullName || "",
						role: data.role || "",
						department: data.department || "",
						year: data.year || "",
					});
					setBio(data.bio || "");
				}
			} catch (err) {
				console.error("Error fetching profile:", err);
			} finally {
				setLoading(false);
			}
		};

		if (userName) fetchProfile();
	}, [userName]);

	// Close emoji picker when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (pickerRef.current && !pickerRef.current.contains(event.target)) {
				setShowEmojiPicker(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Handle editable fields change
	const handleFieldChange = (e) => {
		const { name, value } = e.target;
		setEditableFields((prev) => {
			const updated = { ...prev, [name]: value };

			const changed =
				updated.fullName !== profile.fullName ||
				updated.role !== profile.role ||
				updated.department !== profile.department ||
				updated.year !== profile.year;

			setFieldsChanged(changed);
			return updated;
		});
	};

	// Enable editing mode for all fields at once on click of any field
	const handleEditFieldsClick = () => {
		setIsEditingFields(true);
		setFieldsChanged(false);
	};

	// Save updated profile fields
	const handleSaveFields = async () => {
		setLoading(true);
		try {
			await updateProfile(editableFields);
			setProfile((prev) => ({ ...prev, ...editableFields }));
			setIsEditingFields(false);
			setFieldsChanged(false);
			alert("Profile updated successfully!");
		} catch (err) {
			alert("Failed to update profile. Please try again.");
			console.error(err);
		}
		setLoading(false);
	};

	// Handle bio textarea change
	const handleBioChange = (e) => {
		setBio(e.target.value);
		setBioChanged(true);
	};

	// Save bio update
	const handleSaveBio = async () => {
		setLoading(true);
		try {
			await updateBioService(bio);
			setProfile((prev) => ({ ...prev, bio }));
			setBioChanged(false);
			setIsEditingBio(false);
			alert("Bio updated successfully!");
		} catch {
			alert("Failed to update bio. Please try again.");
		}
		setLoading(false);
	};

	// Emoji picker selection
	const onEmojiClick = (emojiData) => {
		setBio((prev) => prev + emojiData.emoji);
		setBioChanged(true);
	};

	// Avatar upload handlers
	const handleAvatarClick = () => fileInputRef.current?.click();

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("avatar", file);

		try {
			const updated = await updateProfilePhoto(formData);
			setProfile((prev) => ({
				...prev,
				avatar: updated.avatar + "?t=" + Date.now(), // cache buster
			}));
		} catch (err) {
			alert("Failed to update avatar. Please try again.");
			console.error(err);
		}
	};

	// Delete account
	const handleDeleteAccount = async () => {
		try {
			await deleteAccount();
			alert("Account deleted");
			navigate("/");
		} catch (err) {
			alert("Error deleting account.");
			console.error(err);
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
		<div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg transition-colors duration-300">
			{/* Avatar and Name Section */}
			<div className="flex flex-col md:flex-row items-center md:items-start gap-8">
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

				<div className="flex-1 space-y-6 text-center md:text-left w-full">
					{/* Edit Button Row */}
					<div className="flex justify-end items-center">
						<h2 className="sr-only">Profile Fields</h2>
						{!isEditingFields ? (
							<button
								onClick={() => setIsEditingFields(true)}
								className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
								aria-label="Edit profile fields"
								title="Edit profile fields"
							>
								Edit
							</button>
						) : (
							<button
								onClick={() => {
									// Reset changes and exit edit mode
									setEditableFields({
										fullName: profile.fullName,
										role: profile.role,
										department: profile.department,
										year: profile.year,
									});
									setFieldsChanged(false);
									setIsEditingFields(false);
								}}
								className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
								aria-label="Cancel editing"
								title="Cancel editing"
							>
								Cancel
							</button>
						)}
					</div>

					{/* Full Name */}
					<div>
						<label className="font-semibold mb-1 block text-gray-700 dark:text-gray-300">
							Full Name:
						</label>
						{isEditingFields ? (
							<input
								type="text"
								name="fullName"
								value={editableFields.fullName}
								onChange={handleFieldChange}
								className="w-full max-w-md p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
							/>
						) : (
							<p
								onClick={handleEditFieldsClick}
								className="cursor-pointer bg-blue-100 dark:bg-blue-900 rounded-md px-3 py-1 text-blue-800 dark:text-blue-300 text-2xl leading-relaxed hover:bg-blue-200 dark:hover:bg-blue-800 transition"
								title="Click to edit"
							>
								{profile.fullName}
							</p>
						)}
					</div>

					<p className="text-lg text-blue-600 dark:text-blue-400 font-semibold italic">
						@{profile.userName}
					</p>

					{/* Editable profile fields - role, department, year */}
					<div className="space-y-4 text-gray-700 dark:text-gray-300 text-base md:text-lg">
						{/* Role */}
						<div>
							<label className="font-semibold mb-1 block">Role:</label>
							{isEditingFields ? (
								<select
									name="role"
									value={editableFields.role}
									onChange={handleFieldChange}
									className="w-full max-w-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
								>
									<option value="Student">Student</option>
									<option value="Faculty">Faculty</option>
									<option value="Cell">Cell</option>
								</select>
							) : (
								<p
									onClick={handleEditFieldsClick}
									className="cursor-pointer bg-blue-100 dark:bg-blue-900 rounded-md px-3 py-1 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
									title="Click to edit"
								>
									{profile.role}
								</p>
							)}
						</div>

						{/* Department */}
						<div>
							<label className="font-semibold mb-1 block">Department:</label>
							{isEditingFields ? (
								<select
									name="department"
									value={editableFields.department}
									onChange={handleFieldChange}
									className="w-full max-w-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
								>
									<option value="CSE">CSE</option>
									<option value="ISE">ISE</option>
									<option value="ECE">ECE</option>
									<option value="EEE">EEE</option>
									<option value="MBA">MBA</option>
									<option value="AIML">AIML</option>
									<option value="AIDS">AIDS</option>
									<option value="CIVIL">CIVIL</option>
								</select>
							) : (
								<p
									onClick={handleEditFieldsClick}
									className="cursor-pointer bg-blue-100 dark:bg-blue-900 rounded-md px-3 py-1 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
									title="Click to edit"
								>
									{profile.department}
								</p>
							)}
						</div>

						{/* Year */}
						<div>
							<label className="font-semibold mb-1 block">Year:</label>
							{isEditingFields ? (
								<select
									name="year"
									value={editableFields.year}
									onChange={handleFieldChange}
									className="w-full max-w-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
								>
									<option value="First-Year">First-Year</option>
									<option value="Second-Year">Second-Year</option>
									<option value="PreFinal-Year">PreFinal-Year</option>
									<option value="Final-Year">Final-Year</option>
								</select>
							) : (
								<p
									onClick={handleEditFieldsClick}
									className="cursor-pointer bg-blue-100 dark:bg-blue-900 rounded-md px-3 py-1 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
									title="Click to edit"
								>
									{profile.year}
								</p>
							)}
						</div>

						{/* Save button for profile fields */}
						{isEditingFields && (
							<button
								disabled={!fieldsChanged || loading}
								onClick={handleSaveFields}
								className={`mt-2 px-6 py-2 rounded font-semibold text-white transition ${
									fieldsChanged
										? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
										: "bg-gray-400 cursor-not-allowed"
								}`}
							>
								{loading ? "Saving..." : "Save"}
							</button>
						)}
					</div>

					{/* Email (non-editable) */}
					<p className="mt-6 text-sm md:text-base text-gray-600 dark:text-gray-400">
						Email:{" "}
						<span className="font-medium text-gray-900 dark:text-white">
							{profile.email}
						</span>
					</p>
				</div>
			</div>

			{/* Bio Section */}
			<div className="mt-10 relative max-w-2xl mx-auto">
				<label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
					Bio
				</label>
				{isEditingBio ? (
					<>
						<textarea
							rows={4}
							value={bio}
							onChange={handleBioChange}
							placeholder="Tell us about yourself..."
							className="w-full p-3 border-2 border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-300"
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
								disabled={loading || !bioChanged}
								onClick={handleSaveBio}
								className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
							>
								{loading ? "Saving..." : "Save"}
							</button>
							<button
								onClick={() => {
									setBio(profile.bio || "");
									setBioChanged(false);
									setIsEditingBio(false);
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
						onClick={() => setIsEditingBio(true)}
						className={`cursor-pointer min-h-[5rem] p-4 border-2 rounded-lg border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300
				  ${bio ? "whitespace-pre-wrap" : "italic text-gray-400 dark:text-gray-500"}
				`}
						title="Click to edit bio"
					>
						{bio || "Click to add a bio"}
					</p>
				)}
			</div>

			{/* Footer actions */}
			<div className="mt-10 flex justify-end gap-4">
				<button
					onClick={() => setShowDeleteConfirm(true)}
					className="px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
					title="Delete your account"
				>
					Delete Account
				</button>
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
						<h2 className="text-xl font-semibold text-red-600 mb-4">
							Confirm Account Deletion
						</h2>
						<p className="mb-4 text-gray-700 dark:text-gray-300">
							This action <strong>cannot</strong> be undone. To confirm, please
							type:
						</p>
						<p className="mb-4 font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
							{confirmationPhrase}
						</p>

						<input
							value={deleteConfirmText}
							onChange={(e) => setDeleteConfirmText(e.target.value)}
							placeholder="Type the confirmation phrase here"
							className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
						/>

						<div className="flex justify-end gap-3">
							<button
								onClick={() => setShowDeleteConfirm(false)}
								className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
							>
								Cancel
							</button>
							<button
								disabled={deleteConfirmText !== confirmationPhrase}
								onClick={handleDeleteAccount}
								className={`px-4 py-2 rounded text-white font-semibold transition ${
									deleteConfirmText === confirmationPhrase
										? "bg-red-600 hover:bg-red-700"
										: "bg-gray-400 cursor-not-allowed"
								}`}
							>
								Confirm Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MyProfile;
