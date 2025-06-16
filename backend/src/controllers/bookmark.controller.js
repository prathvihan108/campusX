import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import STATUS_CODES from "../constants/statusCodes.js";
import client from "../utils/redisClient.js";

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
    console.log("📌 Post bookmarked, cache cleared");

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
    console.log("❌ Bookmark removed, cache cleared");

    res
      .status(STATUS_CODES.OK)
      .json(new ApiResponse(STATUS_CODES.OK, {}, "Bookmark removed"));
  }
});

// Get Bookmarked Posts for the Logged-in User
const getUserBookmarkedPosts = AsyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Try cache first
  // const cached = await client.get(`bookmarks:${userId}`);
  // console.log("Bookmarks from cache :" + JSON.parse(cached));
  // if (cached) {
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

  // Fetch posts where the user has bookmarked
  const posts = await Post.find({ bookmarks: userId })
    .select("content image category likesCount bookmarksCount createdAt") // only required fields
    .populate("author", "fullName userName avatar");
  // Cache result
  // try {
  //   await client.setEx(`bookmarks:${userId}`, 3600, JSON.stringify(posts));
  //   console.log("✅ Bookmarks cached for user");
  //   console.log("Bookmarks: " + posts);
  // } catch (err) {
  //   console.error("Redis caching failed:", err);
  // }
  console.log("Bookmarks from backend: " + posts);

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
