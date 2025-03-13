import { sub } from "../config/redis.js";

const subscribeLikeStatus = (io, userSockets) => {
  console.log("🟡 Initializing Redis subscription...");
  sub.on("error", (err) => console.error("❌ Redis Client Error:", err));
  sub.on("connect", async () => {
    console.log("✅ Connected to Redis successfully.");

    try {
      await sub.subscribe("like_status");
      console.log("✅ Subscribed to 'like_status' channel.");
    } catch (err) {
      console.error("❌ Redis subscription error:", err);
    }
  });

  sub.on("message", (channel, message) => {
    console.log("📩 sub.on triggered with message:", message);

    if (channel === "like_status") {
      const data = JSON.parse(message);
      console.log("📌 Data received:", data);

      const ownerSocketId = userSockets.get(data.postOwnerId);
      console.log("📡 Owner Socket ID:", ownerSocketId);

      if (ownerSocketId) {
        io.to(ownerSocketId).emit("like_status", data);
        console.log("📤 Sent like notification to:", ownerSocketId);
      } else {
        console.log("⚠️ Post owner not online:", data.postOwnerId);
      }
    }
  });
};

export { subscribeLikeStatus };
