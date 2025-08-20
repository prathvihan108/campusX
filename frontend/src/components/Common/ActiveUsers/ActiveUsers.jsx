import React, { useEffect, useState } from "react";
import { fetchTotalUsersCount } from "../../../services/userServices.jsx";

function ActiveUsers() {
	const [totalUsers, setTotalUsers] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function getCount() {
			try {
				const count = await fetchTotalUsersCount();
				setTotalUsers(count);
			} catch (err) {
				setError(err.message);
			}
		}
		getCount();
	}, []);

	return (
		<div className="w-full md:w-auto md:ml-6 mt-4 md:mt-0 flex justify-center md:justify-start items-center p-2 bg-gray-100 rounded-md text-gray-700 font-medium text-base">
			{error ? (
				<span className="text-red-600">Error: {error}</span>
			) : totalUsers === null ? (
				<span className="italic text-blue-700">Loading active users...</span>
			) : (
				<>
					<span className="text-blue-700">Active Users: </span>
					<span className="ml-2 font-bold text-blue-700">{totalUsers}</span>
				</>
			)}
		</div>
	);
}

export default ActiveUsers;
