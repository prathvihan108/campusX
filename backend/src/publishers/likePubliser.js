import { pub } from "../config/redis.js";

async function publishLikeStatus(status, postOwnerId, userId) {
  console.log("published Like status");

  if (!pub.isOpen) {
    console.log("🟡 Connecting Redis publisher...");
    await pub.connect();
  }

  try {
    await pub.publish(
      "like_status",
      JSON.stringify({ status, postOwnerId, userId })
    );
    console.log("✅ Like status published successfully");
  } catch (err) {
    console.error("❌ Error publishing like status:", err);
  }
}

export default publishLikeStatus;
