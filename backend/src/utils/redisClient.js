// import { createClient } from "redis";

// const client = createClient();

// client.on("error", (err) => console.error("Redis Error1:", err));

// await client.connect();

// console.log("Connected to Redis");

// export default client;

import { createClient } from "redis";

const redisHost = process.env.REDIS_HOST || "redis"; // use 'redis' as the default
const redisPort = process.env.REDIS_PORT || 6379;

const client = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

client.on("error", (err) => console.error("Redis Error1:", err));

await client.connect();

console.log("Connected to Redis");

export default client;
