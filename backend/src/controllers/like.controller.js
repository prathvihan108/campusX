import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import STATUS_CODES from "../constants/statusCodes.js";
import publishLikeStatus from "../publishers/likePubliser.js";
// Like or Unlike a Post
const toggleLike = AsyncHandler(async (req, res) => {
  const { postId } = req.params; // Extract postId from URL

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(STATUS_CODES.NOT_FOUND, "Post not found");

  const userIndex = post.likes.indexOf(req.user._id);

  if (userIndex === -1) {
    post.likes.push(req.user._id);
    post.likesCount += 1;

    await post.save();
    publishLikeStatus("liked", post.author, req.user._id);
    res
      .status(STATUS_CODES.OK)
      .json(new ApiResponse(STATUS_CODES.OK, {}, "Post liked"));
  } else {
    post.likes.splice(userIndex, 1);
    post.likesCount -= 1;
    await post.save();
    res
      .status(STATUS_CODES.OK)
      .json(new ApiResponse(STATUS_CODES.OK, {}, "Like removed"));
  }
});

export { toggleLike };
