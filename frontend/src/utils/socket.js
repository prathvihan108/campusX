import { io } from "socket.io-client";

//const SOCKET_URL = "https://10.101.7.74:8005"; // backend URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

console.log(SOCKET_URL);

const socket = io(SOCKET_URL, {
	path: "/socket.io", // explicitly set correct path
	transports: ["websocket"],
	withCredentials: true,
});

socket.on("connect", () => {
	console.log("Connected to  WebSocket Server! :Socket ID:", socket.id);
});

// Listen for connection errors
socket.on("connect_error", (err) => {
	console.error(" WebSocket connection error:", err);
	console.log("socket url:", SOCKET_URL);
});

// Automatically re-register the user after refresh
const userId = localStorage.getItem("userId");
if (userId) {
	socket.emit("register", userId);
	console.log("Re-registered socket after refresh for user:", userId);
}

export { socket };
