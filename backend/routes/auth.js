const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    const { name, email, mobile, password } = req.body;

    // Normalize inputs
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const cleanMobile = mobile ? mobile.trim() : '';
    const cleanPassword = password ? password.trim() : ''; // Trim password to avoid copy-paste spaces

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    let user = await User.findOne({ email: cleanEmail });
    console.log('User found:', user);
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cleanPassword, salt);

    // Create user
    user = new User({
      name: name ? name.trim() : '',
      email: cleanEmail,
      mobile: cleanMobile,
      password: hashedPassword
    });
    console.log('New user created (sanitized):', user.email);

    await user.save();
    console.log('User saved to database');

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Normalize inputs
    const identifier = email ? email.toLowerCase().trim() : '';
    const cleanPassword = password ? password.trim() : '';

    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }]
    });

    if (!user) {
      console.log('Login failed: User not found for:', identifier);
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(cleanPassword, user.password);
    if (!isPasswordValid) {
      console.log(`Login failed: Invalid password for user: ${identifier}. Input len: ${cleanPassword.length}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for:', identifier);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get current user (for auth checking)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { contact } = req.body; // Can be email or mobile
    if (!contact) return res.status(400).json({ message: 'Email or Mobile required' });

    // Find user by email OR mobile
    const user = await User.findOne({
      $or: [{ email: contact }, { mobile: contact }]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // MOCK SENDING (Log to console)
    console.log(`========================================`);
    console.log(`OTP for ${user.email} / ${user.mobile}: ${otp}`);
    console.log(`========================================`);

    res.json({ message: 'OTP sent successfully (Check server console)' });

  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login with OTP
router.post('/login-otp', async (req, res) => {
  try {
    const { contact, otp } = req.body;
    if (!contact || !otp) return res.status(400).json({ message: 'Contact and OTP required' });

    const user = await User.findOne({
      $or: [{ email: contact }, { mobile: contact }]
    });

    if (!user) return res.status(400).json({ message: 'User not found' });

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check Expiry
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP Expired' });
    }

    // Clear OTP after successful login
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user });

  } catch (err) {
    console.error('OTP Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/update', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, mobile } = req.body;

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name.trim();
    if (mobile) user.mobile = mobile.trim();

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
