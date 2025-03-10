import { Bookmark } from "../models/bookmark.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.models.js";
import client from "../utils/redisClient.js";
// Add a Post to Bookmarks
const bookmarkPost = AsyncHandler(async (req, res) => {
  const { postId } = req.params;
  console.log("postId", postId);
  const post = await Post.findById(postId);
  console.log("post", post);
  if (!post) throw new ApiError(404, "Post not found");

  //no need to check if post is already bookmarked as the front-end will have the control to show the bookmark button only if the post is not already bookmarked
  console.log("post.author:", post.author);

  const bookmark = await Bookmark.create({
    post_owner: post.author,
    post: postId,
  });

  req.user.bookmarks.push(bookmark._id);
  await req.user.save({ validateBeforeSave: false });

  res
    .status(201)
    .json(new ApiResponse(201, bookmark, "Post bookmarked successfully"));
});

//  Remove Bookmark
const removeBookmark = AsyncHandler(async (req, res) => {
  const { bookmarkId } = req.params;

  const bookmark = await Bookmark.findById(bookmarkId);
  if (!bookmark) throw new ApiError(404, "Bookmark not found");

  await Bookmark.deleteOne({ _id: bookmarkId });

  req.user.bookmarks = req.user.bookmarks.filter(
    (id) => id.toString() !== bookmarkId.toString()
  );
  await req.user.save();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Bookmark removed successfully"));
});

//  Get User's Bookmarked Posts
const getUserBookmarks = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  const cachedBookmarks = await client.get(`bookmarks:${user}`);
  console.log("cachedBookmarks", cachedBookmarks);
  if (cachedBookmarks) {
    return res.json(
      new ApiResponse(
        200,
        JSON.parse(cachedBookmarks),
        "bookmarks from Redis cache"
      )
    );
  }

  const bookmarks = await Bookmark.find({ _id: { $in: user.bookmarks } })
    .populate("post", "content image category likesCount")
    .populate("post_owner", "fullName userName avatar");

  console.log("bookmarks", bookmarks);

  try {
    await client.setEx(`bookmarks:${user}`, 3600, JSON.stringify(bookmarks));
    console.log("bookmarks cached");
  } catch (err) {
    console.error("Redis caching error:", err);
  }

  res
    .status(200)
    .json(new ApiResponse(200, bookmarks, "Bookmarked posts fetched"));
});

export { bookmarkPost, removeBookmark, getUserBookmarks };
