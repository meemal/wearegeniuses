const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
require('./config/firebase');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/profile', require('./routes/profile'));
app.use('/api/directory', require('./routes/directory'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

module.exports = app; 