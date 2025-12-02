const { STATUS_CODES, ERROR_MESSAGES } = require('../constants');

// Centralized error handler
const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const route = req.originalUrl || req.url;

  // Log the error
  console.error(`[${timestamp}] ERROR on ${method} ${route}:`);
  console.error(err);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      message: ERROR_MESSAGES.UNAUTHORIZED
    });
  }

  if (err.name === 'CastError') {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      message: 'Invalid ID format'
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = {
  errorHandler
};
