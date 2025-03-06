import { ApiResponse } from "../utils/ApiResponse.js";
import { sendOtp } from "../utils/sendOtp.js";

let otpStore = new Map();

export const sendOtpController = async (req, res) => {
  console.log("sendOtpController called");
  const { email } = req.body;
  console.log("Email:", email);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(email, otp);

  await sendOtp(email, otp);
  console.log("OTP sent successfully");
  res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
};

export const verifyOtpController = (req, res) => {
  const { email, otp } = req.body;

  if (otpStore.get(email) === otp) {
    otpStore.delete(email);
    res
      .status(200)
      .json(new ApiResponse(200, null, "OTP verified successfully"));
  } else {
    res.status(400).json(new ApiResponse(400, null, "Invalid OTP"));
  }
};
