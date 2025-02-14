import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

import {
  bookmarkPost,
  removeBookmark,
  getUserBookmarks,
} from "../controllers/bookmark.controller.js";
const router = Router();

router.post("/", varifyJWT, upload.none(), bookmarkPost); // POST /api/v1/bookmarks
router.delete("/:bookmarkId", varifyJWT, removeBookmark); // DELETE /api/v1/bookmarks/:bookmarkId
router.get("/", varifyJWT, getUserBookmarks); // GET /api/v1/bookmarks

export default router;
