import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

// ✅ Add a Comment
const addComment = AsyncHandler(async (req, res) => {
  const { postId } = req.params; // Extract postId from URL
  const { text } = req.body; // Extract text from body

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");
  if (!text) {
    throw new ApiError(400, "comment message not found");
  }

  const comment = await Comment.create({
    post: postId,
    author: req.user._id,
    content: text,
  });
  await comment.populate({
    path: "author",
    select: "fullName email avatar", // Select fields you need
  });

  post.comments.push(comment._id);
  await post.save({ validateBeforeSave: false });

  res.status(201).json(new ApiResponse(201, comment, "Comment added"));
});

// ✅ Get Comments for a Post
const getComments = AsyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .populate("user", "fullName userName avatar")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, comments, "Comments fetched"));
});

// ✅ Delete a Comment (Only Author or Post Owner Can Delete)
const deleteComment = AsyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  const post = await Post.findById(comment.post);
  if (!post) throw new ApiError(404, "Post not found");

  if (
    comment.user.toString() !== req.user._id.toString() &&
    post.author.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Unauthorized");
  }

  await comment.deleteOne();
  post.comments = post.comments.filter(
    (id) => id.toString() !== commentId.toString()
  );
  await post.save();

  res.status(200).json(new ApiResponse(200, {}, "Comment deleted"));
});

export { addComment, getComments, deleteComment };
