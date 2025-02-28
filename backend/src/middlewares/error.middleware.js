import { ApiError } from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
  console.error("Middleware Error:", err.message);

  // If error is instance of ApiError class
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // If any other unknown error
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};

export default errorMiddleware;
