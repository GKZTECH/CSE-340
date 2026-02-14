const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token; // cookie name must match what you set during login
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded; // contains account_id, firstname, account_type, etc.
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
};