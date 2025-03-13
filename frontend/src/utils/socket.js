import { io } from "socket.io-client";

const SOCKET_URL = "https://localhost:8005"; // backend URL

const socket = io(SOCKET_URL, {
	transports: ["websocket"],
	withCredentials: true,
});

// Automatically re-register the user after refresh
const userId = localStorage.getItem("userId");
if (userId) {
	socket.emit("register", userId);
	console.log("Re-registered socket after refresh for user:", userId);
}

export { socket };
