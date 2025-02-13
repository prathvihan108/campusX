import { Post } from "../models/postModel.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";
// ✅ Like or Unlike a Post
const toggleLike = AsyncHandler(async (req, res) => {
  const { postId } = req.body;

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const userIndex = post.likes.indexOf(req.user._id);

  if (userIndex === -1) {
    post.likes.push(req.user._id);
    post.likesCount += 1;
    await post.save();
    res.status(200).json(new ApiResponse(200, {}, "Post liked"));
  } else {
    post.likes.splice(userIndex, 1);
    post.likesCount -= 1;
    await post.save();
    res.status(200).json(new ApiResponse(200, {}, "Like removed"));
  }
});

export { toggleLike };
