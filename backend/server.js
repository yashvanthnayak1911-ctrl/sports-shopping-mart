const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const app = express();

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'backend.log'), { flags: 'a' });

// Redirect stdout and stderr
const logger = new console.Console(accessLogStream, accessLogStream);
const originalLog = console.log;
const originalError = console.error;

console.log = (...args) => {
  originalLog(...args);
  logger.log(new Date().toISOString(), ...args);
};

console.error = (...args) => {
  originalError(...args);
  logger.error(new Date().toISOString(), ...args);
};

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Sports E-Commerce API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access from other devices: http://192.168.1.8:${PORT}`);

  // Keep-alive mechanism to prevent Render from sleeping
  // Keep-alive mechanism to prevent Render from sleeping
  const pingInterval = 14 * 60 * 1000; // 14 minutes (Render sleeps after 15)
  setInterval(() => {
    const axios = require('axios');
    // Use the public Render URL if available, otherwise localhost
    const backendUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

    axios.get(backendUrl)
      .then(() => console.log(`Keep-alive ping successful to ${backendUrl}: ${new Date().toISOString()}`))
      .catch(err => console.error(`Keep-alive ping failed: ${err.message}`));
  }, pingInterval);

  console.log('Keep-alive mechanism initialized (14 min interval)');
});
