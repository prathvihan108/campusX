import { Router } from "express";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import {
  followUser,
  unfollowUser,
  isFollowing,
  getFollowers,
  getFollowing,
} from "../controllers/follow.controller.js";

const router = Router();
router.post("/:userId/follow", varifyJWT, followUser);
router.post("/:userId/unfollow", varifyJWT, unfollowUser);
router.get("/:userId/is-following", varifyJWT, isFollowing);
router.get("/me", varifyJWT, getFollowers);
router.get("/meFollowing", varifyJWT, getFollowing);

export default router;
