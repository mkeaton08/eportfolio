const User = require('../models/user');

// Find user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ email: email.toLowerCase().trim() }).exec();
};

// Create a new user
const createUser = async (userData) => {
  const user = new User({
    name: userData.name,
    email: userData.email,
    role: userData.role
  });
  user.setPassword(userData.password);
  return await user.save();
};

// Get user by ID
const getUserById = async (userId) => {
  return await User.findById(userId).exec();
};

module.exports = {
  findUserByEmail,
  createUser,
  getUserById
};
