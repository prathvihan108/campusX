import { ApiError } from "./ApiError.js";
const AsyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      // console.error("Error while handling response:", error);
      next(error);
    }
  };
};

export { AsyncHandler };
