// Application constants
module.exports = {
  // User roles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin'
  },

  // HTTP status codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },

  // Error messages
  ERROR_MESSAGES: {
    ALL_FIELDS_REQUIRED: 'All fields required',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden - Insufficient permissions',
    INVALID_TOKEN: 'Invalid or missing token',
    USER_NOT_FOUND: 'User not found',
    TRIP_NOT_FOUND: 'Trip not found',
    VALIDATION_ERROR: 'Validation error',
    INTERNAL_ERROR: 'Internal server error'
  },

  // JWT settings
  JWT: {
    EXPIRES_IN: '1h'
  }
};
