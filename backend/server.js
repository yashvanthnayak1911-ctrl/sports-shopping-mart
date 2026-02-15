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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Sports E-commerce API (Backend)',
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

// Ping route for keep-alive
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});


// Connect to MongoDB (Async)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server immediately (don't wait for DB, to allow debugging)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);

  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`Access from other devices: http://${net.address}:${PORT}`);
      }
    }
  }

  // Keep-alive mechanism
  const pingInterval = 14 * 60 * 1000; // 14 minutes
  setInterval(() => {
    const axios = require('axios');
    const backendUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

    // Ping the /ping endpoint specifically
    axios.get(`${backendUrl}/ping`)
      .then(() => console.log(`Keep-alive ping successful to ${backendUrl}/ping: ${new Date().toISOString()}`))
      .catch(err => console.error(`Keep-alive ping failed: ${err.message}`));
  }, pingInterval);

  console.log('Keep-alive mechanism initialized');
});
