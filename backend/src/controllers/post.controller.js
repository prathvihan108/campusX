import axios from "axios";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import STATUS_CODES from "../constants/statusCodes.js";
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
  console.log(req.user._id, "created a post");

  // Populate the author with selected fields
  await post.populate({
    path: "author",
    select: "fullName email avatar",
  });

  res
    .status(STATUS_CODES.CREATED)
    .json(
      new ApiResponse(STATUS_CODES.CREATED, post, "Post created successfully")
    );
});

// Get All Posts with Aggregation
const getAllPosts = AsyncHandler(async (req, res) => {
  let posts;
  const userId = req.query.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const skip = (page - 1) * limit;

  console.log(
    `getAllPosts called for user: ${userId} page: ${page}, limit: ${limit}`
  );

  if (userId) {
    try {
      const { data } = await axios.post("http://localhost:8000/recommend", {
        user_id: userId,
      });

      const recommendedIds = data.recommendations || [];

      const pagedRecommendedIds = recommendedIds.slice(skip, skip + limit);

      if (pagedRecommendedIds.length === 0) {
        posts = [];
      } else {
        const objectIds = pagedRecommendedIds.map(
          (id) => new mongoose.Types.ObjectId(id)
        );

        posts = await Post.aggregate([
          {
            $match: { _id: { $in: objectIds } },
          },
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

        posts = objectIds
          .map((id) => posts.find((p) => p._id.equals(id)))
          .filter(Boolean);
      }
    } catch (err) {
      console.error("Recommendation API failed:", err.message);
      // fallback to normal posts on error
    }
  }

  if (!posts || posts.length === 0) {
    console.log("Fetching fallback posts with pagination");

    posts = await Post.aggregate([
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
      { $skip: skip },
      { $limit: limit },
    ]);
  }

  return res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, posts, "Posts fetched successfully")
    );
});

// Get Posts by Specific User
const getUserPosts = AsyncHandler(async (req, res) => {
  console.log("fetch userPosts function called");
  const userId = req.params.userId;
  console.log("User ID:", userId);
  const posts = await Post.aggregate([
    {
      $match: {
        author: new mongoose.Types.ObjectId(userId),
      },
    },
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
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(
        STATUS_CODES.OK,
        posts,
        "User's posts fetched successfully"
      )
    );
});

//  Get Single Post by ID with Aggregation
const getPostById = AsyncHandler(async (req, res) => {
  const postId = req.params.id;
  const cachedPost = await client.get(`post:${postId}`);

  //check for the cached post.
  if (cachedPost) {
    return res.json(
      new ApiResponse(
        STATUS_CODES.OK,
        JSON.parse(cachedPost),
        "Post from Redis cache"
      )
    );
  }
  //mongo db  aggregation pipeline to fetch all the posts.
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

  if (!post.length)
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Post not found");

  //cache the post to redis
  try {
    await client.setEx(`post:${postId}`, 3600, JSON.stringify(post[0]));
  } catch (err) {
    console.error("Redis caching error:", err);
  }

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, post[0], "Post fetched successfully")
    );
});

//  Delete Post (Only Author Can Delete)
const deletePost = AsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) throw new ApiError(STATUS_CODES.NOT_FOUND, "Post not found");
  if (post.author.toString() !== req.user._id.toString())
    throw new ApiError(STATUS_CODES.FORBIDDEN, "FORBIDDEN");

  await post.deleteOne();
  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, {}, "Post deleted successfully"));
});

export { createPost, getAllPosts, getUserPosts, getPostById, deletePost };
