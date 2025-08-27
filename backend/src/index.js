import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import https from "https"; //production testing
import http from "http"; //local testing

import fs from "fs";
import { app } from "./app.js";
import connectDB from "./db/db.js";
import connectWebSocket from "./webSocket/webSocket.js";
import { connectRedis } from "./config/redis.js";

console.log(
  "Starting backend. REDIS_HOST:",
  process.env.REDIS_HOST,
  "REDIS_PORT:",
  process.env.REDIS_PORT
);

// const options = {
//   key: fs.readFileSync("key.pem"),
//   cert: fs.readFileSync("cert.pem"),
// };

const port = process.env.PORT || 3000;
// const host_url = process.env.HOST_URL || "https://localhost";

let server;

console.log("Connecting to MongoDB...");
connectDB()
  .then(async () => {
    //https:
    // server = https.createServer(options, app);

    // server.listen(port, async () => {
    //   console.log(`🚀 Server running on ${host_url}:${port}`);

    //   try {
    //     await connectRedis();
    //     connectWebSocket(server);
    //   } catch (err) {
    //     console.error(" Redis Connection Failed!", err);
    //   }
    // });

    //http
    server = http.createServer(app);

    // Start the server
    server.listen(port, "0.0.0.0", async () => {
      // console.log(`🚀 Server running on ${host_url}:${port}`);
      console.log(`🚀 Server1 running on http://0.0.0.0:${port}`);

      try {
        console.log(
          "Attempting Redis connection at",
          process.env.REDIS_HOST,
          process.env.REDIS_PORT
        );

        await connectRedis();
        connectWebSocket(server);
      } catch (err) {
        console.error("❌ Redis Connection Failed!", err);
      }
    });
  })
  .catch((err) => {
    console.log(" MongoDB Connection Failed!", err);
  });

export { server };
