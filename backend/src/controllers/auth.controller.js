import { ApiResponse } from "../utils/ApiResponse.js";
import { sendOtp } from "../utils/sendOtp.js";
import STATUS_CODES from "../constants/statusCodes.js";

let otpStore = new Map();

export const sendOtpController = async (req, res) => {
  console.log("sendOtpController called");
  const { email } = req.body;
  console.log("Email:", email);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(email, otp);

  await sendOtp(email, otp);
  console.log("OTP sent successfully");
  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, null, "OTP sent successfully"));
};

export const verifyOtpController = (req, res) => {
  const { email, otp } = req.body;

  if (otpStore.get(email) === otp) {
    otpStore.delete(email);
    res
      .status(STATUS_CODES.OK)
      .json(
        new ApiResponse(STATUS_CODES.OK, null, "OTP verified successfully")
      );
  } else {
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(new ApiResponse(STATUS_CODES.BAD_REQUEST, null, "Invalid OTP"));
  }
};
