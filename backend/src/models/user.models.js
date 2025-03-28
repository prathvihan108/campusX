import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Bookmark } from "./bookmark.model.js";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["Student", "Faculty", "Cell"],
      required: true,
    },
    year: {
      type: String,
      enum: ["First-Year", "Second-Year", "PreFinal-Year", "Final-Year"],
      required: true,
    },
    department: {
      type: String,
      enum: ["CSE", "ISE", "ECE", "EEE", "MBA", "AIML", "AIDS", "CIVIL"],
      required: true,
    },
    avatar: {
      //cloudanary
      type: String,
      required: true,
    },
    coverImage: {
      //cloudanary
      type: String,
    },

    bio: { type: String, required: true },

    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bookmark",
      },
    ],

    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
//do not use the arrow functions ,since they do not have the this access.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("findOneAndDelete", async function (next) {
  console.log("Cascade Delete Triggered");
  await Bookmark.deleteMany({ _id: { $in: this.bookmarks } });
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);
