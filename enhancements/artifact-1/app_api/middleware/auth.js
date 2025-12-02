const jwt = require('jsonwebtoken');
const { STATUS_CODES, ERROR_MESSAGES, ROLES } = require('../constants');

// Middleware to verify JWT token
const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({ 
      message: ERROR_MESSAGES.INVALID_TOKEN 
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({ 
      message: 'Invalid authorization header format' 
    });
  }

  const token = parts[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ 
        message: ERROR_MESSAGES.INVALID_TOKEN 
      });
    }
    req.auth = decoded;
    next();
  });
};

// Middleware to check user role
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ 
        message: ERROR_MESSAGES.UNAUTHORIZED 
      });
    }

    const userRole = req.auth.role || ROLES.USER;

    if (!allowedRoles.includes(userRole)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({ 
        message: ERROR_MESSAGES.FORBIDDEN 
      });
    }

    next();
  };
};

module.exports = {
  requireAuth,
  requireRole
};
