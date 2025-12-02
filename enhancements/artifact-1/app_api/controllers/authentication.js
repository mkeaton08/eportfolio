const passport = require('passport');
const userService = require('../services/userService');
const { STATUS_CODES, ERROR_MESSAGES } = require('../constants');

// POST: /register - register a new user
const register = async (req, res, next) => {
  try {
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'user' // Default to 'user' role
    };

    const user = await userService.createUser(userData);
    const token = user.generateJWT();
    
    return res.status(STATUS_CODES.OK).json({ token });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ 
        message: 'Email already exists' 
      });
    }
    next(err);
  }
};

// POST: /login - authenticate user
const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json(
        info || { message: ERROR_MESSAGES.UNAUTHORIZED }
      );
    }
    
    const token = user.generateJWT();
    return res.status(STATUS_CODES.OK).json({ token });
  })(req, res, next);
};

module.exports = {
  register,
  login
};
