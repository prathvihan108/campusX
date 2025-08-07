import { AsyncHandler } from "../utils/AsyncHandler.js";
import STATUS_CODES from "../constants/statusCodes.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Post } from "../models/post.model.js";

import { Subscription } from "../models/subscription.model.js";
import mongoose, { Schema } from "mongoose";
import client from "../utils/redisClient.js";
import {
  deleteAvatar,
  deleteCoverImage,
  updateAvatar,
  updateCoverImage,
  uploadOnCloudnary,
} from "../utils/cloudnary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_ERROR,
      "something went wrong while generating acess and refresh token"
    );
  }
};

const registerUser = AsyncHandler(async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Request Files:", req.files);

  if (!req.files || Object.keys(req.files).length === 0) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "No files uploaded");
  }
  const { fullName, email, userName, password, role, year, department, bio } =
    req.body;
  console.log(email);

  if (
    [fullName, email, userName, password, role, year, department, bio].some(
      (field) => (field?.trim?.() ?? "") === ""
    )
  ) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "All required fields must be filled"
    );
  }

  // Ensure role is valid
  const validRoles = ["Student", "Faculty", "Cell"];
  if (!validRoles.includes(role)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid role");
  }

  const validYears = [
    "First-Year",
    "Second-Year",
    "PreFinal-Year",
    "Final-Year",
  ];
  if (!validYears.includes(year)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid Year");
  }

  const validDepartments = [
    "CSE",
    "ISE",
    "ECE",
    "EEE",
    "MBA",
    "AIML",
    "AIDS",
    "CIVIL",
  ];
  if (!validDepartments.includes(department)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid department");
  }

  const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
  console.log("Existing User:", existingUser);

  if (existingUser) {
    return res
      .status(STATUS_CODES.CONFLICT)
      .json(
        new ApiResponse(STATUS_CODES.CONFLICT, null, "User already exists")
      );
    // throw new ApiError(STATUS_CODES.CONFLICT, "User already exists");
  }

  console.log(req.files);

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Avatar is required");
  }

  const avatar = await uploadOnCloudnary(avatarLocalPath);
  console.log * ("Avatar:", avatar);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudnary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Avatar upload to Cloudinary failed"
    );
  }
  console.log("Role:", role, "Year:", year);

  const user = await User.create({
    fullName: fullName.trim(),
    avatar: avatar?.url || "",
    coverImage: coverImage?.url || "",
    email: email.toLowerCase().trim(),
    password,
    userName: userName.toLowerCase().trim(),
    role,
    year,
    department,
    bio: bio?.trim() || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log("created user", createdUser);

  if (!createdUser) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_ERROR,
      "Error while registering user!!"
    );
  }

  return res
    .status(STATUS_CODES.CREATED)
    .json(
      new ApiResponse(
        STATUS_CODES.CREATED,
        { createdUser },
        "User created successfully"
      )
    );
});

const loginUser = AsyncHandler(async (req, res) => {
  //req==>data
  //user name and email
  //find the user
  //password check
  //access and refres token
  //send cookie
  const { email, password } = req.body;
  console.log("Request Body:", req.body);
  console.log(email);
  if (!email) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "username or email is required"
    );
  }

  const user = await User.findOne({
    $or: [{ email }],
  });

  console.log("user:", user);
  if (!user) {
    return res
      .status(STATUS_CODES.NOT_FOUND)
      .json(
        new ApiResponse(STATUS_CODES.NOT_FOUND, null, "user does not exits")
      );
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log("isPasswordValid", isPasswordValid);

  if (!isPasswordValid) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "password not valid");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  // u need to make the database query again because the user referene is just a snapshot of the currne state of the database and not the live object

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // syntax:res.cookie(name, value, options);
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };
  return res
    .status(STATUS_CODES.OK)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        STATUS_CODES.OK,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfully"
      )
    );
});

const logoutUser = AsyncHandler(async (req, res) => {
  console.log("user id is", req.user._id);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true, //u will get the updated value.
    }
  );

  console.log("Refresh token after logout", console.log(user.refreshToken));

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };
  return res
    .status(STATUS_CODES.OK)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(STATUS_CODES.OK, user, "user logged out"));
});

const refreshAccessToken = AsyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      "unauthorised request:refresh token not found"
    );
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    ); //this is jwt varification

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, "invalid  refresh token");
    }
    //verify from the database too

    if (incomingRefreshToken != user?.refreshToken) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        "refresh token is expired or used"
      );
    }
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user?._id
    );
    res
      .status(STATUS_CODES.OK)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          STATUS_CODES.OK,
          { accessToken, refreshToken },
          "accessToken refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_ERROR,
      "error while refreshing the access token" + error.message
    );
  }
});

const changeCurrentPassword = AsyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confPassword } = req.body;
  console.log(" body:", req.body);
  if (!(newPassword === confPassword)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Passwords do not match");
  }
  const user = await User.findById(req.user?._id);
  console.log("user ", user);
  console.log("User password:", user.password);
  console.log("old password:", oldPassword);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  console.log("isPasswordCorrect :", isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "password is wrong");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, {}, "Password chanaged successfully")
    );
});

const getCurrentUser = AsyncHandler(async (req, res) => {
  return res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(
        STATUS_CODES.OK,
        { user: req.user },
        "Curent user feteched successfully"
      )
    );
});

const updateAccountDetails = AsyncHandler(async (req, res) => {
  const { fullName, role, department, year } = req.body;

  // Fetch current user data first
  const existingUser = await User.findById(req.user?._id);
  if (!existingUser) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "User not found");
  }

  // Prepare updated fields by using new value if present, otherwise keep old
  const updatedFields = {
    fullName: fullName || existingUser.fullName,
    role: role || existingUser.role,
    department: department || existingUser.department,
    year: year || existingUser.year,
  };

  // Update user with merged values
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: updatedFields },
    { new: true }
  ).select("-password");

  return res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, user, "Updated profile successfully")
    );
});

const updateUserAvatar = AsyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "avatar file not found");
  }

  const user = await User.findById(req.user?._id);

  const oldCloudinaryUrl = user.avatar;
  console.log("Old cloudnary url", oldCloudinaryUrl);
  const avatar = await updateAvatar(oldCloudinaryUrl, avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "error while uploading avatar"
    );
  }

  await User.findByIdAndUpdate(
    user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, {}, "avatar updated successfully"));
});

const updateUserCoverImage = AsyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  console.log("Cover image path", coverImageLocalPath);
  if (!coverImageLocalPath) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "coverImage file not found");
  }

  const user = await User.findById(req.user?._id);

  const oldCloudinaryUrl = user.coverImage;
  console.log("Old cloudnary url", oldCloudinaryUrl);
  const coverImage = await updateCoverImage(
    oldCloudinaryUrl,
    coverImageLocalPath
  );
  if (!coverImage.url) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Error while uploading cover image"
    );
  }

  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        coverImage: coverImage.url, // Correct field
      },
    },
    { new: true }
  );

  return res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, {}, "coverImage updated successfully")
    );
});

const getUserChannelProfile = AsyncHandler(async (req, res) => {
  const user = req.params.user?.toLowerCase().trim();

  if (!user) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "User name is missing");
  }

  // const cachedChannel = await client.get(`channel:${user}`);
  // console.log("cached channel", cachedChannel);
  // if (cachedChannel) {
  //   return res.json(
  //     new ApiResponse(
  //       STATUS_CODES.OK,
  //       JSON.parse(cachedChannel),
  //       "channel from Redis cache"
  //     )
  //   );
  // }
  console.log("userName: ", user);
  //channel will be an array
  const channel = await User.aggregate([
    {
      $match: { userName: user },
    }, //filter
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",

        as: "subscribers",
      },
    },

    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",

        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },

    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedTo: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          //to know wether the user is subscribed to a channel
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        userName: 1,
        bio: 1,
        department: 1,
        year: 1,
        role: 1,
        subscribersCount: 1,
        channelsSubscribedTo: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);
  console.log("channel: ", channel);

  if (!channel?.length) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "channel does not exits");
  }

  try {
    await client.setEx(`channel:${user}`, 3600, JSON.stringify(channel[0]));
    console.log("Channel cached");
  } catch (err) {
    console.error("Redis caching error:", err);
  }

  return res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, channel[0], "User channel feteched")
    );
});

const getBookmarks = AsyncHandler(async (req, res) => {
  const cachedBookmarks = await client.get(`bookmarks:${user}`);

  if (cachedBookmarks) {
    return res.json(
      new ApiResponse(
        STATUS_CODES.OK,
        JSON.parse(cachedBookmarks),
        "bookmarks from Redis cache"
      )
    );
  }

  const user = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.user._id) },
    },
    {
      $lookup: {
        from: "bookmarks",
        localField: "bookmarks",
        foreignField: "_id",
        as: "bookmarkedPosts",
        pipeline: [
          {
            $lookup: {
              from: "posts", // Fetch the actual post
              localField: "post",
              foreignField: "_id",
              as: "postDetails",
            },
          },
          {
            $unwind: "$postDetails", //flatens array into separate documents
          },
          {
            $lookup: {
              from: "users", // Fetch post author details
              localField: "postDetails.author",
              foreignField: "_id",
              as: "postOwner",
            },
          },
          {
            $unwind: "$postOwner",
          },
          {
            $project: {
              _id: 1,
              post: "$postDetails", // Include full post data
              owner: {
                _id: "$postOwner._id",
                fullName: "$postOwner.fullName",
                userName: "$postOwner.userName",
                avatar: "$postOwner.avatar",
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        fullName: 1,
        userName: 1,
        bookmarks: "$bookmarkedPosts", // Renames the field
      },
    },
  ]);

  console.log("user", user);

  try {
    await client.setEx(
      `bookmarks:${user}`,
      3600,
      JSON.stringify(user[0].bookmarks)
    );
  } catch (err) {
    console.error("Redis caching error:", err);
  }

  return res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(
        STATUS_CODES.OK,
        user[0].bookmarks,
        "Bookmarked posts fetched successfully"
      )
    );
});

const deleteAccount = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res
      .status(STATUS_CODES.NOT_FOUND)
      .json(new ApiResponse(STATUS_CODES.NOT_FOUND, null, "User not found"));
  }
  const coverImageCloudinaryUrl = user.coverImage;
  const avatarCloudinaryUrl = user.avatar;
  console.log("Cover Image Cloudinary URL:", coverImageCloudinaryUrl);
  console.log("Avatar Image Cloudinary URL:", avatarCloudinaryUrl);

  await deleteCoverImage(coverImageCloudinaryUrl);
  await deleteAvatar(avatarCloudinaryUrl);

  console.info("User ID:", user._id);

  const postsBefore = await Post.find({ author: user._id });
  console.log("Posts Before Deletion:", postsBefore.length);

  await Post.deleteMany({ author: user._id }); //pre hooks automatically will handle the deletion of thepost images and comments

  const postsAfter = await Post.find({ author: user._id });
  console.log("Posts After Deletion:", postsAfter.length);

  await User.findByIdAndDelete(user._id);
  console.log("Accout deleted succss");

  return res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, null, "Account deleted successfully")
    );
});

//update bio
const updateBio = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res
      .status(STATUS_CODES.NOT_FOUND)
      .json(new ApiResponse(STATUS_CODES.NOT_FOUND, null, "User not found"));
  }

  const { bio } = req.body;

  if (typeof bio !== "string" || bio.trim().length > 500) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(
        new ApiResponse(
          STATUS_CODES.BAD_REQUEST,
          null,
          "Bio must be a valid string with a maximum of 500 characters"
        )
      );
  }

  user.bio = bio.trim();

  await user.save({ validateBeforeSave: false });

  console.info("Bio updated for User ID:", user._id);

  return res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(
        STATUS_CODES.OK,
        { bio: user.bio },
        "Bio updated successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getBookmarks,
  deleteAccount,
  updateBio,
};

//userSearch
export const searchUserFullNames = AsyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Query parameter "query" is required and must be a string'
    );
  }

  const regex = new RegExp(query, "i");

  // Find matching users by userName or fullName, return only fullName and _id for identification
  const users = await User.find({
    $or: [{ userName: regex }, { fullName: regex }],
  })
    .select("fullName _id userName avatar")
    .limit(10)
    .lean();

  return res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(
        STATUS_CODES.OK,
        users,
        "User full name suggestions fetched successfully"
      )
    );
});
