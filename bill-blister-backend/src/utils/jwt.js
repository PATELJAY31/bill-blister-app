const jwt = require('jsonwebtoken');
const config = require('../config');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Generate refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: '30d', // Refresh tokens last longer
  });
};

// Generate token pair (access + refresh)
const generateTokenPair = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: generateToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

// Decode token without verification (for debugging)
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  generateTokenPair,
  decodeToken,
};
