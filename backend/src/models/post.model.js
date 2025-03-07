import mongoose, { Schema } from "mongoose";
import { Comment } from "./comment.model.js";
import { deleteImage } from "../utils/cloudnary.js";

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
    console.log(`Deleting comments and image for post: ${this._id}`);

    // Delete Comments
    await Comment.deleteMany({ post: this._id });

    // Delete Post Image if Exists
    await deleteImage(this.image);

    next();
  }
);

postSchema.pre(
  "deleteMany",
  { document: false, query: true },
  async function (next) {
    const posts = await this.model.find(this.getFilter());

    for (const post of posts) {
      console.log(`Deleting comments and image for post: ${post._id}`);

      await Comment.deleteMany({ post: post._id });

      await deleteImage(post.image);
    }

    next();
  }
);

const Post = mongoose.model("Post", postSchema);

export { Post };
