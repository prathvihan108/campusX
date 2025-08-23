import { createClient } from "redis";
const redisHost = process.env.REDIS_HOST || "redis";
const redisPort = process.env.REDIS_PORT || "6379";

const redisUrl = `redis://${redisHost}:${redisPort}`;
console.log("Using Redis Host:", process.env.REDIS_HOST);

console.log("Connecting to Redis at:", redisUrl);

const pub = createClient({ url: redisUrl });
const sub = createClient({ url: redisUrl });

pub.on("error", (err) => console.error(" Redis Publisher Error:", err));
sub.on("error", (err) => console.error(" Redis Subscriber Error:", err));

async function connectRedis() {
  try {
    await pub.connect();
    console.log(" Redis Publisher Connected");

    await sub.connect();
    console.log("Redis Subscriber Connected");
  } catch (err) {
    console.error(" Redis Connection Error:", err);
  }
}

export { pub, sub, connectRedis };
