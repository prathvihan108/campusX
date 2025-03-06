import mongoose, { Schema } from "mongoose";
import { Comment } from "./comment.model.js";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    image: { type: String },
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
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

postSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Deleting comments for post: ${this._id}`);
    await Comment.deleteMany({ post: this._id });
    next();
  }
);

const Post = mongoose.model("Post", postSchema);

export { Post };
