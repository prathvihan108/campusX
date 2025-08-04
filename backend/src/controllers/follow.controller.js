import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import STATUS_CODES from "../constants/statusCodes.js";

const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const subscriberId = req.user._id;

    if (userId === subscriberId.toString()) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json(
          new ApiResponse(
            STATUS_CODES.BAD_REQUEST,
            null,
            "You cannot follow yourself"
          )
        );
    }

    const subscription = await Subscription.create({
      subscriber: subscriberId,
      channel: userId,
    });
    console.log("followed user");

    res
      .status(STATUS_CODES.OK)
      .json(
        new ApiResponse(STATUS_CODES.OK, subscription, "Followed successfully")
      );
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const subscriberId = req.user._id;

    const subscription = await Subscription.findOneAndDelete({
      subscriber: subscriberId,
      channel: userId,
    });

    if (!subscription) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json(
          new ApiResponse(
            STATUS_CODES.NOT_FOUND,
            null,
            "Subscription not found"
          )
        );
    }
    console.log("Unfollowed user");

    res
      .status(STATUS_CODES.OK)
      .json(new ApiResponse(STATUS_CODES.OK, null, "Unfollowed successfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

const isFollowing = async (req, res) => {
  try {
    const subscriberId = req.user._id;
    const { userId } = req.params;

    const isFollowing = await Subscription.exists({
      subscriber: subscriberId,
      channel: userId,
    });

    res
      .status(STATUS_CODES.OK)
      .json(
        new ApiResponse(
          STATUS_CODES.OK,
          { isFollowing: !!isFollowing },
          "Follow status fetched"
        )
      );
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};
const getFollowers = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const followers = await Subscription.find({ channel: userId })
      .populate(
        "subscriber",
        "fullName userName email avatar role year department bio"
      )
      .skip(skip)
      .limit(limit);

    // (Optional) You can also return total count to calculate total pages on frontend
    const totalFollowers = await Subscription.countDocuments({
      channel: userId,
    });

    res
      .status(STATUS_CODES.OK)
      .json(
        new ApiResponse(
          STATUS_CODES.OK,
          { followers, totalFollowers },
          "Followers fetched successfully"
        )
      );
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

const getFollowing = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    console.log(
      "getting following for user:",
      userId + " page:",
      page,
      " limit:",
      limit
    );

    const following = await Subscription.find({ subscriber: userId })
      .populate(
        "channel",
        "fullName userName email avatar role year department bio"
      )
      .skip(skip)
      .limit(limit);

    const totalFollowing = await Subscription.countDocuments({
      subscriber: userId,
    });

    res
      .status(STATUS_CODES.OK)
      .json(
        new ApiResponse(
          STATUS_CODES.OK,
          { following, totalFollowing },
          "Following users fetched successfully"
        )
      );
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export { followUser, unfollowUser, isFollowing, getFollowers, getFollowing };
