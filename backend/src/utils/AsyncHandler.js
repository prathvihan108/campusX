//wrapper method for handling async errors
const AsyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      console.error("Error while handling response:");
      next(error);
    }
  };
};

export { AsyncHandler };
