import express from "express";
import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/comment.controller.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/:postId", getComments);

router.post("/:postId", varifyJWT, upload.none(), addComment);

router.delete("/:commentId", varifyJWT, deleteComment);

export default router;
