import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

// Middleware to verify the JWT token
// This middleware will be used to protect the routes that require authentication.
export const varifyJWT = AsyncHandler(async (req, res, next) => {
  try {
    console.log("access token", req.cookies?.accessToken);
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("Token:", token);

    if (!token) {
      console.log("No token found");
      throw new ApiError(401, "Unauthorised request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      // doubt :how to  handle this in the front-end
      throw new ApiError(402, "invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    // console.log("error,may be token expired", error);
    throw new ApiError(401, "Token expired");
  }
});
