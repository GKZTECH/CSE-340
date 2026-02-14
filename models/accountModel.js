const pool = require('../utils/pool'); // your database connection pool

// Get account by ID (exclude password)
async function getAccountById(id) {
  const [rows] = await pool.query(
    'SELECT account_id, firstname, lastname, email, account_type FROM account WHERE account_id = ?',
    [id]
  );
  return rows[0];
}

// Update firstname, lastname, email
async function updateAccountInfo(id, firstname, lastname, email) {
  await pool.query(
    'UPDATE account SET firstname = ?, lastname = ?, email = ? WHERE account_id = ?',
    [firstname, lastname, email, id]
  );
}

// Update password (already hashed)
async function updatePassword(id, hashedPassword) {
  await pool.query(
    'UPDATE account SET password = ? WHERE account_id = ?',
    [hashedPassword, id]
  );
}

// Assume getAccountByEmail already exists
// async function getAccountByEmail(email) { ... }

module.exports = {
  // ... existing exports
  getAccountById,
  updateAccountInfo,
  updatePassword
};