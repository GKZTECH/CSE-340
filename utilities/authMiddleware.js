const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../server');

const authMiddleware = {};

// Middleware to check if user is authenticated
authMiddleware.isAuthenticated = (req, res, next) => {
  if (res.locals.loggedIn) {
    return next();
  }
  
  req.session.messages = {
    error: 'Please login to access this page.'
  };
  return res.redirect('/account/login');
};

// Middleware to check if user has Employee or Admin role for inventory management
authMiddleware.isEmployeeOrAdmin = (req, res, next) => {
  if (res.locals.loggedIn && 
      (res.locals.user.account_type === 'Employee' || 
       res.locals.user.account_type === 'Admin')) {
    return next();
  }
  
  req.session.messages = {
    error: 'Access denied. Employee or Admin privileges required.'
  };
  return res.redirect('/account/login');
};

// Middleware to check specific account type
authMiddleware.checkAccountType = (allowedTypes) => {
  return (req, res, next) => {
    if (res.locals.loggedIn && allowedTypes.includes(res.locals.user.account_type)) {
      return next();
    }
    
    req.session.messages = {
      error: 'Access denied. Insufficient privileges.'
    };
    return res.redirect('/account/login');
  };
};

module.exports = authMiddleware;