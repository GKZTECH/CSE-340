module.exports = (req, res, next) => {
  if (res.locals.user && (res.locals.user.account_type === 'Employee' || res.locals.user.account_type === 'Admin')) {
    return next();
  }
  // Use flash message or query parameter; here we use flash (requires connect-flash)
  req.flash('error', 'You must be an employee or admin to access that page.');
  res.redirect('/account/login');
};