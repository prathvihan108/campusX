import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";

import likeRouter from "./routes/like.routes.js";
import bookmarkRouter from "./routes/bookmark.routes.js";
import followerRouter from "./routes/follow.routes.js";
import commentRouter from "./routes/comment.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

//  middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
// app.use(cors({ origin: "http://127.0.0.1:5173", credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cookieParser());

//  routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/bookmarks", bookmarkRouter);
app.use("/api/v1/followers", followerRouter);
app.use("/api/v1/comments", commentRouter);

app.get("/", (req, res) => {
  res.send("hello");
});

app.use(errorMiddleware);

export { app };
