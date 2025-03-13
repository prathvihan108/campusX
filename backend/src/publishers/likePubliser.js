import { pub } from "../config/redis.js";

async function publishLikeStatus(status, postOwnerId, userId) {
  console.log("published Like status");
  await pub.publish(
    "like_status",
    JSON.stringify({ status, postOwnerId, userId })
  );
}

export default publishLikeStatus;
