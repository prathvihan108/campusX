import { Router } from "express";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleBookmark,
  getUserBookmarkedPosts,
} from "../controllers/bookmark.controller.js";

const router = Router();

// Toggle bookmark (add/remove) on a post
router.route("/:postId").post(varifyJWT, toggleBookmark);

// Get all bookmarks for the logged-in user
router.route("/").get(varifyJWT, getUserBookmarkedPosts);

export default router;
