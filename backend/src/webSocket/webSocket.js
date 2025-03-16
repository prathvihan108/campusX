import { Server } from "socket.io";
import { subscribeLikeStatus } from "../redis_pub_sub/subscribers/likeSubscriber.js";

const userSockets = new Map();

const connectWebSocket = async (server) => {
  try {
    const io = new Server(server, {
      cors: { origin: "*" },
    });

    console.log("WebSocket server started");

    console.log(" Initializing Redis subscription...");
    await subscribeLikeStatus(io, userSockets);
    console.log(" Redis subscription initialized");

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // Register user when they log in
      socket.on("register", (userId) => {
        console.log("🔹 User registered(ID):", userId, "Socket ID:", socket.id);
        userSockets.set(userId, socket.id);
        socket.userId = userId;
      });

      // Remove user from tracking when they disconnect
      socket.on("disconnect", () => {
        if (socket.userId) {
          userSockets.delete(socket.userId);
          console.log(" User disconnected:", socket.userId);
        }
        console.log("Client disconnected:", socket.id);
      });
    });
  } catch (error) {
    console.error(" WebSocket setup error:", error);
  }
};

export default connectWebSocket;
