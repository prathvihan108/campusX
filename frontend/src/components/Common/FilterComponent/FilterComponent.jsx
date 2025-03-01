import { useState } from "react";

export default function FilterComponent({ onFilterChange }) {
	const tags = [
		"General",
		"Exams",
		"Placements",
		"Hackathons",
		"Competitions",
		"Lost & Found",
	];

	const roles = ["Student", "Faculty", "Cell"];
	const years = ["First-Year", "Second-Year", "PreFinal-Year", "Final-Year"];
	const departments = [
		"CSE",
		"ISE",
		"ECE",
		"EEE",
		"MBA",
		"AIML",
		"AIDS",
		"CIVIL",
	];

	const [selectedTag, setSelectedTag] = useState("General");
	const [selectedRole, setSelectedRole] = useState("Student");
	const [selectedYear, setSelectedYear] = useState("First-Year");
	const [selectedDepartment, setSelectedDepartment] = useState("CSE");

	const handleFilterChange = () => {
		onFilterChange({
			selectedTag,
			selectedRole,
			selectedYear,
			selectedDepartment,
		});
	};

	return (
		<div className=" p-3 sm:p-4 space-y-3 sm:space-y-4 lg:w-[25vw] lg:fixed lg:top-1/4 lg:left-1/16">
			<div className="bg-blue-500 text-white text-center py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300 w-full text-base font-semibold">
				Apply Filters
			</div>

			<div className="grid grid-cols-2 space-y-4 gap-1.5">
				<div>
					<label className="block text-sm font-semibold mb-1">Tags</label>
					<select
						className="border rounded-lg p-2 w-full"
						value={selectedTag}
						onChange={(e) => {
							setSelectedTag(e.target.value);
							handleFilterChange();
						}}
					>
						{tags.map((tag) => (
							<option key={tag} value={tag}>
								#{tag}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-semibold mb-1">Post By</label>
					<select
						className="border rounded-lg p-2 w-full"
						value={selectedRole}
						onChange={(e) => {
							setSelectedRole(e.target.value);
							handleFilterChange();
						}}
					>
						{roles.map((role) => (
							<option key={role} value={role}>
								{role}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-semibold mb-1">Year</label>
					<select
						className="border rounded-lg p-2 w-full"
						value={selectedYear}
						onChange={(e) => {
							setSelectedYear(e.target.value);
							handleFilterChange();
						}}
					>
						{years.map((year) => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-semibold mb-1">Department</label>
					<select
						className="border rounded-lg p-2 w-full"
						value={selectedDepartment}
						onChange={(e) => {
							setSelectedDepartment(e.target.value);
							handleFilterChange();
						}}
					>
						{departments.map((dept) => (
							<option key={dept} value={dept}>
								{dept}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}
