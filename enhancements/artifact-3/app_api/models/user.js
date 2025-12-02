const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name:  { type: String, required: true, trim: true },
  hash:  { type: String, required: true },
  salt:  { type: String, required: true },
  role:  { type: String, default: 'user', enum: ['user', 'admin'] }
});

// Method to set the password on this record.
userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Method to compare entered password against stored hash
userSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

// Method to generate a JSON Web Token for the current record
userSchema.methods.generateJWT = function() {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name, role: this.role },
    process.env.JWT_SECRET, // SECRET stored in .env file
    { expiresIn: '1h' }     // Token expires an hour from creation
  );
};

module.exports = mongoose.model('users', userSchema);