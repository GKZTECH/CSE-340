const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false   // ✅ mandatory for Render PostgreSQL
  }
});

pool.on('connect', () => console.log('✅ Database connected'));
pool.on('error', (err) => console.error('❌ Database pool error:', err));

module.exports = pool;