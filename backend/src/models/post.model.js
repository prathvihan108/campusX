import mongoose, { Schema } from "mongoose";
const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    image: { type: String }, // Optional image/video URL
    category: {
      type: String,
      enum: [
        "general",
        "exams",
        "placements",
        "competitions",
        "hackathons",
        "lost_found",
      ],
      default: "general",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked
    likesCount: { type: Number, default: 0 }, // Optimized like count
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export { Post };
