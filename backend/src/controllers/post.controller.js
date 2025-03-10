import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudnary } from "../utils/cloudnary.js";
import client from "../utils/redisClient.js";
import mongoose from "mongoose";

//  Create a Post
const createPost = AsyncHandler(async (req, res) => {
  console.log(req.file);
  const imageLocalPath = req.file?.path;
  console.log("image local path", imageLocalPath);

  const image = imageLocalPath ? await uploadOnCloudnary(imageLocalPath) : null;
  const { content, category } = req.body; //category will be enum

  const post = await Post.create({
    author: req.user._id, // Authenticated user
    content,
    category,
    image: image?.url || "",
  });

  // Populate the author with selected fields
  await post.populate({
    path: "author",
    select: "fullName email avatar",
  });

  res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
});

// Get All Posts with Aggregation
const getAllPosts = AsyncHandler(async (req, res) => {
  const posts = await Post.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    { $unwind: "$authorDetails" },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "author",
        foreignField: "channel",
        as: "followers",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
        followerCount: { $size: "$followers" },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

//  Get Single Post by ID with Aggregation
const getPostById = AsyncHandler(async (req, res) => {
  const postId = req.params.id;
  const cachedPost = await client.get(`post:${postId}`);

  if (cachedPost) {
    return res.json(
      new ApiResponse(200, JSON.parse(cachedPost), "Post from Redis cache")
    );
  }

  const post = await Post.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(postId) } },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    { $unwind: "$authorDetails" },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "author",
        foreignField: "channel",
        as: "followers",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
        followerCount: { $size: "$followers" },
      },
    },
  ]);

  if (!post.length) throw new ApiError(404, "Post not found");

  try {
    await client.setEx(`post:${postId}`, 3600, JSON.stringify(post[0]));
  } catch (err) {
    console.error("Redis caching error:", err);
  }

  res
    .status(200)
    .json(new ApiResponse(200, post[0], "Post fetched successfully"));
});

//  Delete Post (Only Author Can Delete)
const deletePost = AsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) throw new ApiError(404, "Post not found");
  if (post.author.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");

  await post.deleteOne();
  res.status(200).json(new ApiResponse(200, {}, "Post deleted successfully"));
});

export { createPost, getAllPosts, getPostById, deletePost };
