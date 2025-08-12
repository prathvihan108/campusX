import { ApiResponse } from "../utils/ApiResponse.js";
import { sendOtp } from "../utils/sendOtp.js";
import STATUS_CODES from "../constants/statusCodes.js";

const otpStore = new Map();

export const sendOtpController = async (req, res) => {
  console.log("sendOtpController called");
  const { email } = req.body;
  console.log("Email:", email);

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
