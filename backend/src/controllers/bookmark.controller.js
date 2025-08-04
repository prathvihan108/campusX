import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import STATUS_CODES from "../constants/statusCodes.js";
import client from "../utils/redisClient.js";
import mongoose from "mongoose";

// Toggle Bookmark on a Post
const toggleBookmark = AsyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(STATUS_CODES.NOT_FOUND, "Post not found");

  const userId = req.user._id;
  const userIndex = post.bookmarks.indexOf(userId);

  if (userIndex === -1) {
    // Add bookmark
    post.bookmarks.push(userId);
    post.bookmarksCount += 1;
    await post.save();

    // Clear cache
    await client.del(`bookmarks:${userId}`);
    console.log("Post bookmarked, cache cleared");

    res
      .status(STATUS_CODES.OK)
      .json(new ApiResponse(STATUS_CODES.OK, {}, "Post bookmarked"));
  } else {
    // Remove bookmark
    post.bookmarks.splice(userIndex, 1);
    post.bookmarksCount -= 1;
    await post.save();

    // Clear cache
    await client.del(`bookmarks:${userId}`);
    console.log(" Bookmark removed, cache cleared");

    res
      .status(STATUS_CODES.OK)
      .json(new ApiResponse(STATUS_CODES.OK, {}, "Bookmark removed"));
  }
});

// Get Bookmarked Posts for the Logged-in User with Pagination
const getUserBookmarkedPosts = AsyncHandler(async (req, res) => {
  const userId = req.user._id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  console.log(
    `Fetching bookmarks for user ${userId} - Page: ${page}, Limit: ${limit}`
  );

  const cacheKey = `bookmarks:${userId}:page:${page}:limit:${limit}`;

  // Try cache first
  // const cached = await client.get(cacheKey);
  // if (cached) {
  //   console.log("Bookmarks from cache :", JSON.parse(cached));
  //   return res
  //     .status(STATUS_CODES.OK)
  //     .json(
  //       new ApiResponse(
  //         STATUS_CODES.OK,
  //         JSON.parse(cached),
  //         "Bookmarked posts from cache"
  //       )
  //     );
  // }

  // Fetch posts where the user has bookmarked with pagination
  const posts = await Post.find({ bookmarks: userId })
    .select("content image category likesCount bookmarksCount createdAt")
    .populate("author", "fullName userName avatar")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); // optional: sort newest first

  // Cache result with expiry (3600 seconds = 1 hour)
  // try {
  //   await client.setEx(cacheKey, 3600, JSON.stringify(posts));
  //   console.log("Bookmarks cached for user");
  // } catch (err) {
  //   console.error("Redis caching failed:", err);
  // }

  //console.log("Bookmarks from backend: ", posts);

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(
        STATUS_CODES.OK,
        posts,
        "Bookmarked posts fetched successfully"
      )
    );
});

export { toggleBookmark, getUserBookmarkedPosts };
