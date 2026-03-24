const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
  
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        error: 'Duplicate entry',
        message: 'A post with this slug already exists'
      });
    }
  
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  
  const asyncHandler = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };
  
  module.exports = { errorHandler, asyncHandler };