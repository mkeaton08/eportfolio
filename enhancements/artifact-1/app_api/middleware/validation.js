const { STATUS_CODES, ERROR_MESSAGES } = require('../constants');

// Validate trip data
const validateTrip = (req, res, next) => {
  const { code, name, length, start, resort, perPerson, image, description } = req.body;
  const errors = [];

  if (!code || typeof code !== 'string' || code.trim() === '') {
    errors.push('code is required and must be a non-empty string');
  }

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('name is required and must be a non-empty string');
  }

  if (!length || typeof length !== 'string') {
    errors.push('length is required and must be a string');
  }

  if (!start) {
    errors.push('start date is required');
  } else {
    const startDate = new Date(start);
    if (isNaN(startDate.getTime())) {
      errors.push('start must be a valid date');
    }
  }

  if (!resort || typeof resort !== 'string' || resort.trim() === '') {
    errors.push('resort is required and must be a non-empty string');
  }

  if (!perPerson || typeof perPerson !== 'string') {
    errors.push('perPerson is required and must be a string');
  }

  if (!image || typeof image !== 'string' || image.trim() === '') {
    errors.push('image is required and must be a non-empty string');
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push('description is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      errors
    });
  }

  next();
};

// Validate user registration data
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('name is required and must be a non-empty string');
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push('email is required and must be a non-empty string');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('email must be a valid email address');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('password is required and must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      errors
    });
  }

  next();
};

// Validate login data
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push('email is required');
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    errors.push('password is required');
  }

  if (errors.length > 0) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      errors
    });
  }

  next();
};

module.exports = {
  validateTrip,
  validateRegistration,
  validateLogin
};
