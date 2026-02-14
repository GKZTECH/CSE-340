const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { validateAccountUpdate, validatePasswordChange } = require("./middleware/validation")
// GET registration form
router.get('/register', accountController.showRegistration);

// POST process registration
router.post('/register', validateRegistration, accountController.register);

// GET update form – note the :id parameter
router.get('/login', accountController.showLogin);

// POST update – handles both forms (distinguished by 'action' field)
router.post('/update', validateAccountUpdate, validatePasswordChange, accountController.processUpdate);

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token'); // name must match the cookie used for JWT
  req.flash('message', 'You have been successfully logged out.'); // optional flash message
  res.redirect('/'); // redirect to home
});

module.exports = router;