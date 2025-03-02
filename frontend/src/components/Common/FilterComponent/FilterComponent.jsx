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

	const roles = ["All", "Student", "Faculty", "Cell"];
	const years = [
		"All",
		"First-Year",
		"Second-Year",
		"PreFinal-Year",
		"Final-Year",
	];
	const departments = [
		"All",
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
	const [selectedRole, setSelectedRole] = useState("All");
	const [selectedYear, setSelectedYear] = useState("All");
	const [selectedDepartment, setSelectedDepartment] = useState("All");
	const [open, setOpen] = useState(false);

	const handleFilterChange = () => {
		onFilterChange({
			selectedTag,
			selectedRole,
			selectedYear,
			selectedDepartment,
		});
	};

	return (
		<div className="p-3 sm:p-4 space-y-3 sm:space-y-4 lg:w-[25vw] lg:sticky lg:top-1/4 lg:left-1/50 lg:self-start">
			<div
				className="bg-white border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-lg cursor-pointer shadow-md hover:bg-gray-100 transition duration-300 w-full text-base font-semibold flex items-center justify-between"
				onClick={() => setOpen(!open)}
			>
				Filters
				<span
					className={`transition-transform duration-300 ${
						open ? "rotate-180" : ""
					} sm:hidden`}
				>
					▼
				</span>
			</div>

			<div
				className={`grid grid-cols-2 gap-1.5 overflow-hidden transition-all duration-300 ${
					open
						? "sm:max-h-none sm:opacity-100 max-h-65 opacity-100"
						: "sm:max-h-none sm:opacity-100 max-h-0 opacity-0"
				}`}
			>
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
					<label className="block text-sm font-semibold mb-1">Posted By</label>
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
				<div>
					<button className="bg-blue-100 text-gray-700 text-m px-3 py-2 rounded-lg shadow hover:bg-gray-200 active:scale-95 transition duration-300 font-medium">
						Clear Filters
					</button>
				</div>
			</div>
		</div>
	);
}
