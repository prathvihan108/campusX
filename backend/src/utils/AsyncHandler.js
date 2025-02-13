const AsyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      console.error("Error while handling response:", error);
      next(error); // Pass the error to Express error middleware
    }
  };
};

export { AsyncHandler };
