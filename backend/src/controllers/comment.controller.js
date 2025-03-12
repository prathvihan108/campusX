import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import STATUS_CODES from "../constants/statusCodes.js";

//  Add a Comment
const addComment = AsyncHandler(async (req, res) => {
  const { postId } = req.params; // Extract postId from URL
  const { text } = req.body; // Extract text from body

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(STATUS_CODES.NOT_FOUND, "Post not found");
  if (!text) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "comment message not found");
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

  res
    .status(STATUS_CODES.CREATED)
    .json(new ApiResponse(STATUS_CODES.CREATED, comment, "Comment added"));
});

//Get Comments for a Post
const getComments = AsyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .populate("author", "fullName userName avatar")
    .sort({ createdAt: -1 });

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, comments, "Comments fetched"));
});

//  Delete a Comment (Only Author or Post Owner Can Delete)
const deleteComment = AsyncHandler(async (req, res) => {
  console.log(req.params);
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(STATUS_CODES.NOT_FOUND, "Comment not found");

  const post = await Post.findById(comment.post);
  if (!post) throw new ApiError(STATUS_CODES.NOT_FOUND, "Post not found");

  if (
    comment.author.toString() !== req.user._id.toString() &&
    post.author.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Unauthorized");
  }

  await comment.deleteOne();
  post.comments = post.comments.filter(
    (id) => id.toString() !== commentId.toString()
  );
  await post.save();

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, {}, "Comment deleted"));
});

export { addComment, getComments, deleteComment };
