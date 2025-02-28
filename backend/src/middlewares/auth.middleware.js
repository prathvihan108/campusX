import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const varifyJWT = AsyncHandler(async (req, res, next) => {
  try {
    console.log("access token", req.cookies?.accessToken);
    const token =
      req.cookies?.accessToken ||
      req.header("Authorisation")?.replace("Bearer ", "");

    console.log("Token:", token);

    if (!token) {
      throw new ApiError(401, "Unautorised request");
    }

    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      //discuss about the front end
      throw new ApiError(402, "invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("error,may be token expired", error);
    return res.status(410).json(new ApiResponse(410, null, "token expired"));
  }
});
