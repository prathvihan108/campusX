import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  sendOtpController,
  verifyOtpController,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.route("/send-otp").post(upload.none(), sendOtpController);
router.route("/verify-otp").post(upload.none(), verifyOtpController);

export default router;
