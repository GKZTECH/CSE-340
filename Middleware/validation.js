const { body } = require('express-validator');

exports.validateAccountUpdate = [
  body('action').notEmpty().withMessage('Action type missing.'),
  body('account_id').isInt().withMessage('Invalid account ID.'),
  body('firstname').trim().notEmpty().withMessage('First name is required.'),
  body('lastname').trim().notEmpty().withMessage('Last name is required.'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required.')
];

exports.validatePasswordChange = [
  body('action').notEmpty().withMessage('Action type missing.'),
  body('account_id').isInt().withMessage('Invalid account ID.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.')
];