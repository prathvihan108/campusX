import { sub } from "../config/redis.js";
const subscribeUserStatus = (io) => {
  sub
    .subscribe("user_status")
    .then(() => {
      console.log("Subscribed to user_status");

      sub.on("message", (channel, message) => {
        if (channel === "user_status") {
          console.log("📢 Received user_status update:", message);
          io.emit("user_status", JSON.parse(message));
        }
      });
    })
    .catch((err) => {
      console.error("❌ Failed to subscribe to user_status:", err);
    });
};
export { subscribeUserStatus };
