import dotenv from "dotenv";
import https from "https"; //production testing
import http from "http"; //local testing

import fs from "fs";
import { app } from "./app.js";
import connectDB from "./db/db.js";
import connectWebSocket from "./webSocket/webSocket.js";
import { connectRedis } from "./config/redis.js";

dotenv.config({ path: "../.env" });

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

const port = process.env.PORT || 5000;
const host_url = process.env.HOST_URL || "https://localhost";

let server;

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
    const server = http.createServer(app);

    // Start the server
    server.listen(port, async () => {
      console.log(`🚀 Server running on ${host_url}:${port}`);

      try {
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
