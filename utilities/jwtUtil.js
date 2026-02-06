const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../server');

const jwtUtil = {};

// Generate JWT token
jwtUtil.generateToken = (userData) => {
  return jwt.sign(
    {
      account_id: userData.account_id,
      account_firstname: userData.account_firstname,
      account_lastname: userData.account_lastname,
      account_email: userData.account_email,
      account_type: userData.account_type
    },
    jwtSecret,
    { expiresIn: '24h' }
  );
};

// Verify JWT token
jwtUtil.verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
};

// Set token cookie
jwtUtil.setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict'
  });
};

// Clear token cookie (logout)
jwtUtil.clearTokenCookie = (res) => {
  res.clearCookie('token');
};

module.exports = jwtUtil;