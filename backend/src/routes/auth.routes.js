import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  sendOtpController,
  verifyOtpController,
  sendResetOtpController,
  resetPasswordController,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.route("/send-otp").post(upload.none(), sendOtpController);
router.route("/verify-otp").post(upload.none(), verifyOtpController);

router.route("/send-reset-otp").post(upload.none(), sendResetOtpController);
router.route("/reset-password").post(upload.none(), resetPasswordController);

export default router;
