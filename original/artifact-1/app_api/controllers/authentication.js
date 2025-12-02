const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport');

const register = async (req, res) => {
  // Validate message to insure that all parameters are present
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ "message": "All fields required" });
  }

  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email
      // no raw password field in the schema
    });
    user.setPassword(req.body.password);
    const q = await user.save();

    if (!q) {
      return res.status(400).json({ "message": "User save failed" });
    } else {
      const token = user.generateJWT();
      return res.status(200).json({ token }); // return an object with token
    }
  } catch (e) {
    return res.status(500).json({ "message": "Registration error", "error": String(e) });
  }
};

const login = (req, res) => { 
  // Validate message to ensure that email and password are present. 
  if (!req.body.email || !req.body.password) { 
    return res.status(400).json({ "message": "All fields required" }); 
  } 

  // Delegate authentication to passport module 
  passport.authenticate('local', (err, user, info) => { 
    if (err) { 
      return res.status(404).json(err); 
    } 
    if (user) { // Auth succeeded - generate JWT and return to caller 
      const token = user.generateJWT(); 
      return res.status(200).json({ token }); 
    } else { // Auth failed return error 
      return res.status(401).json(info); 
    } 
  })(req, res); 
};

// FIXED: proper exports
module.exports = {
  register,
  login
};