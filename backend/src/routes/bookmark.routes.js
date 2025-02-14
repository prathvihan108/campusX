import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

import {
  bookmarkPost,
  removeBookmark,
  getUserBookmarks,
} from "../controllers/bookmark.controller.js";
const router = Router();

router.post("/:postId", varifyJWT, upload.none(), bookmarkPost);
router.delete("/:bookmarkId", varifyJWT, removeBookmark);
router.get("/", varifyJWT, getUserBookmarks);

export default router;
