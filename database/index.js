const { Pool } = require('pg');
require('dotenv').config();

let pool;

// Check if we're in production (Render) or development
if (process.env.NODE_ENV === 'production') {
  // Production database configuration for Render
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  // Development database configuration
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/cse340_db',
    ssl: false
  });
}

// Test the connection
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

module.exports = pool;