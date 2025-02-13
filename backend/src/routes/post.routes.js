import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
} from "../controllers/post.controller.js";
import { toggleLike } from "../controllers/like.controller.js";
import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/comment.controller.js";
import {
  bookmarkPost,
  removeBookmark,
  getUserBookmarks,
} from "../controllers/bookmark.controller.js";

const router = Router();

// ✅ Post Routes
router.post("/posts", varifyJWT, upload.none(), createPost);
router.get("/posts", getAllPosts);
router.get("/posts/:id", getPostById);
router.delete("/posts/:id", varifyJWT, deletePost);

// ✅ Like Route
router.post("/likes", varifyJWT, upload.none(), toggleLike);

// ✅ Comment Routes
router.post("/comments", varifyJWT, upload.none(), addComment);
router.get("/comments/:postId", getComments);
router.delete("/comments/:commentId", varifyJWT, deleteComment);

// ✅ Bookmark Routes
router.post("/bookmarks", varifyJWT, upload.none(), bookmarkPost);
router.delete("/bookmarks/:bookmarkId", varifyJWT, removeBookmark);
router.get("/bookmarks", varifyJWT, getUserBookmarks);

export default router;
