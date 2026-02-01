const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String }, // Mobile number
  password: { type: String, required: true },
  otp: { type: String }, // Temporary OTP
  otpExpires: { type: Date }, // OTP Expiry
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
