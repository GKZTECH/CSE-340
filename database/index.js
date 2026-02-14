const { Pool } = require("pg")
require("dotenv").config()

let pool
if (process.env.NODE_ENV == "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  })
}

module.exports = pool
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

// Add a test query to see if it connects on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error("❌ Database Connection Error:", err.message)
  } else {
    console.log("🚀 Database Connected Successfully at:", res.rows[0].now)
  }
})