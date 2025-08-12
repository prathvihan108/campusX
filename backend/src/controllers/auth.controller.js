import { ApiResponse } from "../utils/ApiResponse.js";
import { sendOtp } from "../utils/sendOtp.js";
import STATUS_CODES from "../constants/statusCodes.js";
import { User } from "../models/user.models.js";

const otpStore = new Map();

export const sendOtpController = async (req, res) => {
  console.log("sendOtpController called");
  const { email } = req.body;
  console.log("Email:", email);

  const existingEmail = await User.findOne({ email: email });
  console.log("Existing email:", existingEmail);

  if (existingEmail) {
    return res
      .status(STATUS_CODES.CONFLICT)
      .json(
        new ApiResponse(STATUS_CODES.CONFLICT, null, "Email already Taken")
      );
  }

  // Validate email domain before generating OTP
  const cmritPattern = /^[a-zA-Z0-9._%+-]+@cmrit\.ac\.in$/;
  if (!cmritPattern.test(email)) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(
        new ApiResponse(STATUS_CODES.BAD_REQUEST, null, "Invalid CMRIT email")
      );
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP with expiry (e.g., 5 minutes)
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now
  otpStore.set(email, { otp, expiresAt });

  // Send OTP via your email service
  await sendOtp(email, otp);
  console.log("OTP sent successfully");

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, null, "OTP sent successfully"));
};

export const verifyOtpController = (req, res) => {
  console.log("verifyOtpController called");
  console.log("Request body:", req.body);
  const { email, otp } = req.body;

  const record = otpStore.get(email);
  if (!record) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(
        new ApiResponse(
          STATUS_CODES.BAD_REQUEST,
          null,
          "OTP expired or not found"
        )
      );
  }

  // Check if OTP expired
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(new ApiResponse(STATUS_CODES.BAD_REQUEST, null, "OTP expired"));
  }
  console.log("record.opt", record.otp, +",otp", otp);

  if (record.otp === otp) {
    otpStore.delete(email);
    return res
      .status(STATUS_CODES.OK)
      .json(
        new ApiResponse(STATUS_CODES.OK, null, "OTP verified successfully")
      );
  } else {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(new ApiResponse(STATUS_CODES.BAD_REQUEST, null, "Invalid OTP"));
  }
};

//Reset-password otp.

const resetOtpStore = new Map(); // Separate map for reset password OTPs

// 1️ Send OTP for password reset
export const sendResetOtpController = async (req, res) => {
  console.log("sendResetOtpController called");
  const { email } = req.body;
  console.log("Email:", email);

  // Check if email exists in DB
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res
      .status(STATUS_CODES.NOT_FOUND)
      .json(new ApiResponse(STATUS_CODES.NOT_FOUND, null, "User not found"));
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

  resetOtpStore.set(email, { otp, expiresAt });

  // Send OTP by email
  await sendOtp(email, otp);
  console.log("Reset OTP sent successfully");

  return res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, null, "Reset OTP sent successfully")
    );
};
export async function resetPasswordController(req, res) {
  console.log("resetPasswordController called");

  const { email, otp, newPassword } = req.body;

  // 1️. Check OTP
  const record = resetOtpStore.get(email);
  if (!record) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(
        new ApiResponse(
          STATUS_CODES.BAD_REQUEST,
          null,
          "OTP expired or not found"
        )
      );
  }

  // 2️. Check if OTP expired
  if (Date.now() > record.expiresAt) {
    resetOtpStore.delete(email);
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(new ApiResponse(STATUS_CODES.BAD_REQUEST, null, "OTP expired"));
  }

  // 3️.Check if OTP matches
  if (record.otp !== otp) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(new ApiResponse(STATUS_CODES.BAD_REQUEST, null, "Invalid OTP"));
  }

  try {
    // 4️.Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json(new ApiResponse(STATUS_CODES.NOT_FOUND, null, "User not found"));
    }

    // 5️.Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    // 6️.Delete OTP record after success
    resetOtpStore.delete(email);

    return res
      .status(STATUS_CODES.OK)
      .json(
        new ApiResponse(STATUS_CODES.OK, null, "Password reset successfully")
      );
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json(
        new ApiResponse(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          null,
          "Server error"
        )
      );
  }
}
