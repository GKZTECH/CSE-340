const accountModel = require("../models/account-model");
const utilities = require("../utilities");
const jwtUtil = require("../utilities/jwtUtil");
const bcrypt = require('bcryptjs');

const accountCont = {};

// Build login view
accountCont.buildLogin = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: [],
      account_email: '',
      messages: req.session.messages || {}
    });
  } catch (error) {
    console.error('Error in buildLogin:', error);
    next(error);
  }
};

// Build registration view
accountCont.buildRegister = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: [],
      account_firstname: '',
      account_lastname: '',
      account_email: '',
      messages: req.session.messages || {}
    });
  } catch (error) {
    console.error('Error in buildRegister:', error);
    next(error);
  }
};

// Register new account
accountCont.registerAccount = async (req, res, next) => {
  try {
    const { account_firstname, account_lastname, account_email, account_password } = req.body;
    
    // Register the account
    const result = await accountModel.registerAccount({
      account_firstname,
      account_lastname,
      account_email,
      account_password
    });
    
    if (result) {
      // Generate JWT token
      const token = jwtUtil.generateToken(result);
      
      // Set token cookie
      jwtUtil.setTokenCookie(res, token);
      
      req.session.messages = {
        success: `Welcome ${account_firstname}! Your account has been created.`
      };
      
      return res.redirect('/account');
    }
  } catch (error) {
    console.error('Error in registerAccount:', error);
    
    let nav = await utilities.getNav();
    let errors = [];
    
    if (error.message === 'Email already exists') {
      errors.push({ msg: 'Email already exists. Please use a different email or login.' });
    } else {
      errors.push({ msg: 'Registration failed. Please try again.' });
    }
    
    res.render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname: req.body.account_firstname || '',
      account_lastname: req.body.account_lastname || '',
      account_email: req.body.account_email || '',
      messages: req.session.messages || {}
    });
  }
};

// Process login
accountCont.loginAccount = async (req, res, next) => {
  try {
    const { account_email, account_password } = req.body;
    
    // Get account by email
    const account = await accountModel.getAccountByEmail(account_email);
    
    if (!account) {
      let nav = await utilities.getNav();
      return res.render("account/login", {
        title: "Login",
        nav,
        errors: [{ msg: 'Invalid email or password.' }],
        account_email: account_email || '',
        messages: req.session.messages || {}
      });
    }
    
    // Check password
    const passwordMatch = await bcrypt.compare(account_password, account.account_password);
    
    if (!passwordMatch) {
      let nav = await utilities.getNav();
      return res.render("account/login", {
        title: "Login",
        nav,
        errors: [{ msg: 'Invalid email or password.' }],
        account_email: account_email || '',
        messages: req.session.messages || {}
      });
    }
    
    // Generate JWT token
    const token = jwtUtil.generateToken({
      account_id: account.account_id,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email,
      account_type: account.account_type
    });
    
    // Set token cookie
    jwtUtil.setTokenCookie(res, token);
    
    req.session.messages = {
      success: `Welcome back, ${account.account_firstname}!`
    };
    
    return res.redirect('/account');
  } catch (error) {
    console.error('Error in loginAccount:', error);
    next(error);
  }
};

// Build account management view (Task 3)
accountCont.buildManagement = async (req, res, next) => {
  try {
    if (!res.locals.loggedIn) {
      req.session.messages = {
        error: 'Please login to access your account.'
      };
      return res.redirect('/account/login');
    }
    
    let nav = await utilities.getNav();
    
    res.render("account/management", {
      title: "Account Management",
      nav,
      account: res.locals.user,
      messages: req.session.messages || {}
    });
  } catch (error) {
    console.error('Error in buildManagement:', error);
    next(error);
  }
};

// Build account update view (Task 4)
accountCont.buildUpdate = async (req, res, next) => {
  try {
    if (!res.locals.loggedIn) {
      req.session.messages = {
        error: 'Please login to update your account.'
      };
      return res.redirect('/account/login');
    }
    
    let nav = await utilities.getNav();
    
    // Get fresh account data
    const account = await accountModel.getAccountById(res.locals.user.account_id);
    
    res.render("account/update", {
      title: "Update Account",
      nav,
      account,
      errors: [],
      messages: req.session.messages || {}
    });
  } catch (error) {
    console.error('Error in buildUpdate:', error);
    next(error);
  }
};

// Update account information (Task 5)
accountCont.updateAccount = async (req, res, next) => {
  try {
    if (!res.locals.loggedIn) {
      req.session.messages = {
        error: 'Please login to update your account.'
      };
      return res.redirect('/account/login');
    }
    
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
    
    // Verify account ownership
    if (parseInt(account_id) !== res.locals.user.account_id) {
      req.session.messages = {
        error: 'Unauthorized access.'
      };
      return res.redirect('/account');
    }
    
    // Update account
    const updatedAccount = await accountModel.updateAccount({
      account_id,
      account_firstname,
      account_lastname,
      account_email
    });
    
    if (updatedAccount) {
      // Generate new JWT token with updated info
      const token = jwtUtil.generateToken(updatedAccount);
      jwtUtil.setTokenCookie(res, token);
      
      req.session.messages = {
        success: 'Account information updated successfully.'
      };
      
      return res.redirect('/account');
    }
  } catch (error) {
    console.error('Error in updateAccount:', error);
    
    let nav = await utilities.getNav();
    let errors = [];
    
    if (error.message === 'Email already exists') {
      errors.push({ msg: 'Email already exists. Please use a different email.' });
    } else {
      errors.push({ msg: 'Failed to update account. Please try again.' });
    }
    
    res.render("account/update", {
      title: "Update Account",
      nav,
      account: {
        account_id: req.body.account_id,
        account_firstname: req.body.account_firstname || '',
        account_lastname: req.body.account_lastname || '',
        account_email: req.body.account_email || '',
        account_type: res.locals.user.account_type
      },
      errors,
      messages: req.session.messages || {}
    });
  }
};

// Update password (Task 5)
accountCont.updatePassword = async (req, res, next) => {
  try {
    if (!res.locals.loggedIn) {
      req.session.messages = {
        error: 'Please login to update your password.'
      };
      return res.redirect('/account/login');
    }
    
    const { account_id, account_password } = req.body;
    
    // Verify account ownership
    if (parseInt(account_id) !== res.locals.user.account_id) {
      req.session.messages = {
        error: 'Unauthorized access.'
      };
      return res.redirect('/account');
    }
    
    // Validate password length
    if (account_password.length < 12) {
      let nav = await utilities.getNav();
      const account = await accountModel.getAccountById(account_id);
      
      return res.render("account/update", {
        title: "Update Account",
        nav,
        account,
        errors: [{ msg: 'Password must be at least 12 characters long.' }],
        messages: req.session.messages || {}
      });
    }
    
    // Update password
    const result = await accountModel.updatePassword({
      account_id,
      account_password
    });
    
    if (result) {
      req.session.messages = {
        success: 'Password updated successfully.'
      };
      
      return res.redirect('/account');
    }
  } catch (error) {
    console.error('Error in updatePassword:', error);
    
    let nav = await utilities.getNav();
    const account = await accountModel.getAccountById(req.body.account_id);
    
    res.render("account/update", {
      title: "Update Account",
      nav,
      account,
      errors: [{ msg: 'Failed to update password. Please try again.' }],
      messages: req.session.messages || {}
    });
  }
};

// Logout (Task 6)
accountCont.logout = (req, res, next) => {
  try {
    // Clear token cookie
    jwtUtil.clearTokenCookie(res);
    
    req.session.messages = {
      success: 'You have been logged out successfully.'
    };
    
    res.redirect('/');
  } catch (error) {
    console.error('Error in logout:', error);
    next(error);
  }
};

module.exports = accountCont;