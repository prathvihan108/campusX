import React from "react";
const Loading = () => {
	return (
		<div className="fixed top-0 left-0 w-full h-full backdrop-blur-md z-50 flex items-center justify-center">
			<div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg">
				<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				<p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
					Loading... Please wait
				</p>
			</div>
		</div>
	);
};

export default Loading;
