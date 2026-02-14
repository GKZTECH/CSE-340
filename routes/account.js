const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { validateAccountUpdate, validatePasswordChange } = require('./middleware/validation');

// GET update form – note the :id parameter
router.get('/update/:id', accountController.showUpdateForm);

// POST update – handles both forms (distinguished by 'action' field)
router.post('/update', validateAccountUpdate, validatePasswordChange, accountController.processUpdate);

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token'); // clear the JWT cookie
  req.flash('message', 'You have been logged out.');
  res.redirect('/');
});

module.exports = router;