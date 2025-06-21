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

router
  .route("/")
  .post(varifyJWT, upload.single("image"), createPost) // Create Post
  .get(getAllPosts); // Get All Posts

router
  .route("/:id")
  .get(getPostById) // Get Post by ID
  .delete(varifyJWT, deletePost); // Delete Post by ID

export default router;
