const accountModel = require('../models/accountModel');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.showLogin = (req, res) => {
  res.render('account/login', { 
    errors: req.flash('errors'), 
    message: req.flash('message') 
  });
};

// Display account update form
exports.showUpdateForm = async (req, res) => {
  try {
    const accountId = req.params.id;
    // Optional: ensure the logged-in user is updating their own account
    if (res.locals.user.account_id != accountId) {
      req.flash('error', 'You can only update your own account.');
      return res.redirect('/account/management');
    }

    const account = await accountModel.getAccountById(accountId);
    if (!account) {
      req.flash('error', 'Account not found.');
      return res.redirect('/account/management');
    }

    res.render('account/update', {
      account,
      errors: req.flash('errors'),
      message: req.flash('message')
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Process both account update and password change
exports.processUpdate = async (req, res) => {
  const { account_id, firstname, lastname, email, password, action } = req.body;

  // Check validation errors (validation middleware already ran)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.array().map(e => e.msg));
    return res.redirect(`/account/update/${account_id}`);
  }

  try {
    if (action === 'update') {
      // Additional check: if email changed, ensure it's not already used by another account
      const existing = await accountModel.getAccountByEmail(email);
      if (existing && existing.account_id != account_id) {
        req.flash('errors', ['Email is already in use by another account.']);
        return res.redirect(`/account/update/${account_id}`);
      }

      await accountModel.updateAccountInfo(account_id, firstname, lastname, email);
      req.flash('message', 'Account information updated successfully.');
    } else if (action === 'password') {
      const hashedPassword = await bcrypt.hash(password, 10);
      await accountModel.updatePassword(account_id, hashedPassword);
      req.flash('message', 'Password changed successfully.');
    } else {
      req.flash('errors', ['Invalid action.']);
      return res.redirect(`/account/update/${account_id}`);
    }

    // After successful update, fetch updated account and go to management view
    const updatedAccount = await accountModel.getAccountById(account_id);
    // Update res.locals.user so the header reflects new name if changed
    res.locals.user = { ...res.locals.user, ...updatedAccount };
    res.render('account/management', {
      user: updatedAccount,
      message: req.flash('message')
    });
  } catch (err) {
    console.error(err);
    req.flash('errors', ['Database error, please try again.']);
    res.redirect(`/account/update/${account_id}`);
  }
};