import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
} from "../controllers/post.controller.js";
import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = Router();

// POST ROUTES
router.post("/", varifyJWT, upload.single("image"), createPost);
router.get("/", getAllPosts); // Get all posts
router.get("/:id", getPostById); // Get a single post by ID
router.delete("/:id", varifyJWT, deletePost); // Delete a post by ID

router.post("/:postId/comments", varifyJWT, upload.none(), addComment);
router.get("/:postId/comments", getComments);
router.delete("/:postId/comments/:commentId", varifyJWT, deleteComment);

export default router;
