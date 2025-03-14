import { io } from "socket.io-client";

const SOCKET_URL = "https://localhost:8005"; // backend URL

const socket = io(SOCKET_URL, {
	transports: ["websocket"],
	withCredentials: true,
});

socket.on("connect", () => {
	console.log("Connected to  WebSocket Server! :Socket ID:", socket.id);
});

// Listen for connection errors
socket.on("connect_error", (err) => {
	console.error("❌ WebSocket connection error:", err);
});

// Automatically re-register the user after refresh
const userId = localStorage.getItem("userId");
if (userId) {
	socket.emit("register", userId);
	console.log("Re-registered socket after refresh for user:", userId);
}

export { socket };
