import { createClient } from "redis";

const pub = createClient({ url: "redis://127.0.0.1:6379" });
const sub = createClient({ url: "redis://127.0.0.1:6379" });

pub.on("error", (err) => console.error("❌ Redis Publisher Error:", err));
sub.on("error", (err) => console.error("❌ Redis Subscriber Error:", err));

async function connectRedis() {
  try {
    await pub.connect();
    console.log("✅ Redis Publisher Connected");

    await sub.connect();
    console.log("✅ Redis Subscriber Connected");
  } catch (err) {
    console.error("❌ Redis Connection Error:", err);
  }
}

export { pub, sub, connectRedis };
