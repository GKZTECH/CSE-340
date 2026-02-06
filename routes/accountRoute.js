const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');
const validation = require('../utilities/validation');

// GET routes
router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/register', utilities.handleErrors(accountController.buildRegister));
router.get('/', utilities.handleErrors(accountController.buildManagement));
router.get('/update', utilities.handleErrors(accountController.buildUpdate));
router.get('/logout', utilities.handleErrors(accountController.logout));

// POST routes
router.post('/register', 
  validation.checkRegistrationData,
  utilities.handleErrors(accountController.registerAccount)
);

router.post('/login',
  validation.checkLoginData,
  utilities.handleErrors(accountController.loginAccount)
);

router.post('/update-account',
  validation.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
);

router.post('/update-password',
  validation.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;