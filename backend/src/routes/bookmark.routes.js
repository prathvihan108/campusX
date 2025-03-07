import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

import {
  bookmarkPost,
  removeBookmark,
  getUserBookmarks,
} from "../controllers/bookmark.controller.js";
const router = Router();

router.route("/:postId").post(varifyJWT, upload.none(), bookmarkPost); // Bookmark Post

router.route("/:bookmarkId").delete(varifyJWT, removeBookmark); // Remove Bookmark

router.route("/").get(varifyJWT, getUserBookmarks); // Get User Bookmarks

export default router;
