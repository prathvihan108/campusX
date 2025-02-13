import { Post } from "../models/postModel.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";

// ✅ Create a Post
const createPost = AsyncHandler(async (req, res) => {
  const { content, category, image } = req.body;

  const post = await Post.create({
    author: req.user._id, // Authenticated user
    content,
    category,
    image,
  });

  res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
});

// ✅ Get All Posts
const getAllPosts = AsyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("author", "fullName userName avatar")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

// ✅ Get Single Post by ID
const getPostById = AsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "fullName userName avatar"
  );

  if (!post) throw new ApiError(404, "Post not found");

  res.status(200).json(new ApiResponse(200, post, "Post fetched successfully"));
});

// ✅ Delete Post (Only Author Can Delete)
const deletePost = AsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) throw new ApiError(404, "Post not found");
  if (post.author.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");

  await post.deleteOne();
  res.status(200).json(new ApiResponse(200, {}, "Post deleted successfully"));
});

export { createPost, getAllPosts, getPostById, deletePost };
