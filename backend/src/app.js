import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";

import likeRouter from "./routes/like.routes.js";
import bookmarkRouter from "./routes/bookmark.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// Apply middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Apply routes

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/bookmarks", bookmarkRouter);

app.get("/", (req, res) => {
  res.send("hello");
});

app.use(errorMiddleware); //should be last

export { app };
