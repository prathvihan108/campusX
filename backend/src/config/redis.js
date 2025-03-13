import { createClient } from "redis";

const pub = createClient({ url: "redis://127.0.0.1:6379" });
const sub = createClient({ url: "redis://127.0.0.1:6379" });

// Event listeners
// sub.on("connect", () => console.log("✅ Subscriber connected"));
// sub.on("error", (err) => console.error("❌ Subscriber error:", err));
// pub.on("connect", () => console.log("✅ Publisher connected"));
// pub.on("error", (err) => console.error("❌ Publisher error:", err));

// Connect once
await pub.connect();

await sub.connect();

export { pub, sub };
