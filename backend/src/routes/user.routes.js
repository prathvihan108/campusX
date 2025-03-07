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
  getBookmarks,
  followUser,
  unfollowUser,
  deleteAccount,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

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
router.route("/channel/:user").get(getUserChannelProfile);

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

router.route("/get-bookmarks").get(varifyJWT, getBookmarks);

router.route("/:userId/follow").post(varifyJWT, followUser);
router.route("/:userId/unfollow").post(varifyJWT, unfollowUser);
router.route("/delete-account").delete(varifyJWT, deleteAccount);

export default router;
