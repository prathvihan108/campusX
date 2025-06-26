import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPost,
  getAllPosts,
  getUserPosts,
  getPostById,
  deletePost,
} from "../controllers/post.controller.js";
import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = Router();

router
  .route("/")
  .post(varifyJWT, upload.single("image"), createPost)
  .get(getAllPosts); // Get All Posts

router.route("/user/:userId").get(getUserPosts); // Get  Posts of user by User ID

router
  .route("/:id")
  .get(getPostById) // Get Post by ID
  .delete(varifyJWT, deletePost); // Delete Post by ID

export default router;
