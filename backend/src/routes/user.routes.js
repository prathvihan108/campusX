import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import { updateAvatar } from "../utils/cloudnary.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

// router.post("/login", loginUser);
router.route("/login").post(upload.none(), loginUser);

//secure routes
router.route("/logout").post(varifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/change-password")
  .post(varifyJWT, upload.none(), changeCurrentPassword);

router.route("/current-user").get(varifyJWT, getCurrentUser);

router
  .route("/update-account")
  .patch(varifyJWT, upload.none(), updateAccountDetails);

router
  .route("/update-avatar")
  .patch(varifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-coverimage")
  .patch(varifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/channel/:user").get(getUserChannelProfile);
router.route("/watch-history").get(varifyJWT, getWatchHistory);

export default router;
