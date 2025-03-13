import { useEffect } from "react";
import { socket } from "../../utils/socket.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LikeNotification = () => {
	useEffect(() => {
		socket.on("like_status", (data) => {
			console.log("Received like_status event:", data);
			if (data?.status === "liked") {
				toast.success(`Post Liked! by ${data?.userId}`, {
					position: "top-right",
					autoClose: 2000,
				});
			}
		});

		return () => {
			socket.off("like_status");
		};
	}, []);

	return null;
};

export default LikeNotification;
