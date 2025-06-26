import React from "react";
import { BellOff } from "lucide-react";

function Noties() {
	return (
		<div className="min-h-[60vh] flex items-center justify-center">
			<div className="text-center">
				<div className="flex justify-center mb-4">
					<BellOff className="w-16 h-16 text-black-400" />
				</div>
				<h2 className="text-xl font-semibold text-black-700 dark:text-gray-200">
					No Notifications Yet
				</h2>
				<p className="text-gray-500 dark:text-black-400 mt-2">
					You're all caught up! Check back later for updates.
				</p>
			</div>
		</div>
	);
}

export default Noties;
