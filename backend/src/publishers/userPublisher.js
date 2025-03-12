import { pub } from "../config/redis.js";

export async function publishUserStatus(status) {
  await pub.publish("user_status", JSON.stringify({ status }));
}
