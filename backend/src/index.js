import dotenv from "dotenv";
import { app } from "./app.js"; // Import `app` from `app.js`
import connectDB from "./db/db.js";

dotenv.config({ path: "../.env" });

console.log(`PORT from env: ${process.env.PORT}`);
const port = process.env.PORT || 8003;
console.log(`Using port: ${port}`);

connectDB()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Failed!", err);
  });
