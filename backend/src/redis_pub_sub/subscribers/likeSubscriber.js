import { sub } from "../../config/redis.js";

const subscribeLikeStatus = async (io, userSockets) => {
  sub.on("error", (err) => console.error(" Redis Client Error:", err));

  if (!sub.isReady) {
    console.log(" Connecting Redis subscriber...");
    await sub.connect();
  }

  try {
    await sub.subscribe("like_status", (message) => {
      console.log("Message received:", message);

      const data = JSON.parse(message);
      console.log(" Data received:", data);

      console.log("All sockets:");
      userSockets.forEach((socketId, userId) => {
        console.log(`User ID: ${userId}, Socket ID: ${socketId}`);
      });

      // Send message to owner if they are online
      const ownerSocketId = userSockets.get(data.postOwnerId);
      console.log(" Owner Socket ID:", ownerSocketId);

      if (ownerSocketId) {
        io.to(ownerSocketId).emit("like_status", data);
        console.log(" Sent like notification to:", ownerSocketId);
      } else {
        console.log("⚠️ Post owner not online:", data.postOwnerId);
      }
    });

    console.log("Subscribed to 'like_status' channel.");
  } catch (err) {
    console.error(" Redis subscription error:", err);
  }
};

export { subscribeLikeStatus };
