const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate users
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authorization required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check subscription
exports.requireSubscription = async (req, res, next) => {
  if (!req.user.hasActiveSubscription) {
    return res.status(403).json({ message: 'Subscription required for this operation' });
  }
  
  next();
}; 