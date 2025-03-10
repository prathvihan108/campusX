import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import { app } from "./app.js"; // Import `app` from `app.js`
import connectDB from "./db/db.js";
import os from "os";
dotenv.config({ path: "../.env" });

// Load SSL certificate
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

// console.log(`PORT from env: ${process.env.PORT}`);
const port = process.env.PORT || 5000;
const host_url = process.env.HOST_URL || "https://localhost";
console.log(`Using port: ${port}`);

connectDB()
  .then(() => {
    const server = https.createServer(options, app).listen(port, () => {
      console.log(`🚀 Server running on ${host_url}:${port}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Failed!", err);
  });
