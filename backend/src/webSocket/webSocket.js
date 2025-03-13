import { Server } from "socket.io";
import { subscribeLikeStatus } from "../subscribers/likeSubscriber.js";

const userSockets = new Map(); // Store userId -> socketId mapping

const connectWebSocket = async (server) => {
  try {
    const io = new Server(server, {
      cors: { origin: "*" },
    });

    console.log("✅ WebSocket server started");

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      subscribeLikeStatus(io, userSockets);

      // Register user when they log in
      socket.on("register", (userId) => {
        console.log("Socket if of the registered user:", userId);
        userSockets.set(userId, socket.id); // Store user socket
      });

      // Remove user from tracking when they disconnect
      socket.on("disconnect", () => {
        userSockets.forEach((value, key) => {
          if (value === socket.id) userSockets.delete(key);
        });
        console.log("Client disconnected:", socket.id);
      });
    });
  } catch (error) {
    console.log("❌ WebSocket setup error:", error);
  }
};

export default connectWebSocket;
