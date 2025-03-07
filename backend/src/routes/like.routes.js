import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import { toggleLike } from "../controllers/like.controller.js";
const router = Router();

router.route("/:postId/like").post(varifyJWT, upload.none(), toggleLike);

export default router;
