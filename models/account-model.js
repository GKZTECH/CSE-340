const pool = require("../database/");
const bcrypt = require('bcryptjs');

const accountModel = {};

// Register new account
accountModel.registerAccount = async ({ account_firstname, account_lastname, account_email, account_password }) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(account_password, 10);
    
    const sql = `INSERT INTO account (
      account_firstname, account_lastname, account_email, account_password, account_type
    ) VALUES ($1, $2, $3, $4, 'Client') RETURNING account_id, account_firstname, account_lastname, account_email, account_type`;
    
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    ]);
    
    return result.rows[0];
  } catch (error) {
    console.error("registerAccount error: " + error);
    
    if (error.code === '23505') { // Unique violation
      throw new Error('Email already exists');
    }
    
    throw error;
  }
};

// Get account by email
accountModel.getAccountByEmail = async (account_email) => {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    console.error("getAccountByEmail error: " + error);
    throw error;
  }
};

// Get account by ID (Task 5)
accountModel.getAccountById = async (account_id) => {
  try {
    const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1";
    const result = await pool.query(sql, [account_id]);
    
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    console.error("getAccountById error: " + error);
    throw error;
  }
};

// Update account information (Task 5)
accountModel.updateAccount = async ({ account_id, account_firstname, account_lastname, account_email }) => {
  try {
    const sql = `UPDATE account 
                 SET account_firstname = $1, 
                     account_lastname = $2, 
                     account_email = $3 
                 WHERE account_id = $4 
                 RETURNING account_id, account_firstname, account_lastname, account_email, account_type`;
    
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ]);
    
    return result.rows[0];
  } catch (error) {
    console.error("updateAccount error: " + error);
    
    if (error.code === '23505') { // Unique violation
      throw new Error('Email already exists');
    }
    
    throw error;
  }
};

// Update password (Task 5)
accountModel.updatePassword = async ({ account_id, account_password }) => {
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(account_password, 10);
    
    const sql = `UPDATE account 
                 SET account_password = $1 
                 WHERE account_id = $2 
                 RETURNING account_id`;
    
    const result = await pool.query(sql, [hashedPassword, account_id]);
    
    return result.rows[0];
  } catch (error) {
    console.error("updatePassword error: " + error);
    throw error;
  }
};

module.exports = accountModel;