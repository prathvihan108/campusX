import { Server } from "socket.io";
import { sub } from "../config/redis.js";
import { subscribeUserStatus } from "../subscribers/userSubscriber.js";

const connectWebSocket = async (server) => {
  try {
    const io = new Server(server, {
      cors: { origin: "*" },
    });

    console.log("✅ WebSocket server started");

    await sub.subscribe("user_status");

    sub.on("message", (channel, message) => {
      if (channel === "user_status") {
        io.emit("user_status", JSON.parse(message));
      }
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      socket.on("disconnect", () => console.log("Client disconnected"));
    });

    subscribeUserStatus(io);
  } catch (error) {
    console.log("❌ WebSocket setup error:", error);
  }
};

export default connectWebSocket;
