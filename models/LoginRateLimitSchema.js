const mongoose = require('mongoose');

const loginAttemptSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  attempts: { type: Number, default: 0 },  
  lastAttempt: { type: Date, default: Date.now },  
  resetTime: { type: Date, required: true },
});

const LoginAttempt = mongoose.model('LoginAttempt', loginAttemptSchema);

module.exports = LoginAttempt;
