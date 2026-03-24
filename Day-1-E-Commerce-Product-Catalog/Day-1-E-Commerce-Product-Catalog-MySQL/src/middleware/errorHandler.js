const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // MySQL duplicate entry error
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      error: "Duplicate entry",
      message: "A product with this SKU already exists",
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      message: err.message,
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Async handler wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = { errorHandler, asyncHandler };