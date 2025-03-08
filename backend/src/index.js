import dotenv from "dotenv";
import { app } from "./app.js"; // Import `app` from `app.js`
import connectDB from "./db/db.js";
import os from "os";
dotenv.config({ path: "../.env" });

// console.log(`PORT from env: ${process.env.PORT}`);
const port = process.env.PORT || 5000;
const host_url = process.env.HOST_URL || "http://localhost";
console.log(`Using port: ${port}`);

connectDB()
  .then(() => {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on ${host_url}:${port}`);
    });

    function getLocalIP() {
      const interfaces = os.networkInterfaces();
      for (const iface of Object.values(interfaces)) {
        for (const config of iface) {
          if (config.family === "IPv4" && !config.internal) {
            return config.address;
          }
        }
      }
      return "127.0.0.1";
    }
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Failed!", err);
  });
