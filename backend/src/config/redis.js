import { createClient } from "redis";

const pub = createClient({ url: "redis://127.0.0.1:6379" });
const sub = createClient({ url: "redis://127.0.0.1:6379" });

await pub.connect();
await sub.connect();

console.log("Redis connected: pub/sub");

export { pub, sub };
