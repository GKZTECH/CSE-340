const pool = require("pg").Pool
const db = new pool({ connectionString: process.env.DATABASE_URL })

async function addReview(review_text, review_rating, inv_id, account_id) {
  const sql = `
    INSERT INTO review (review_text, review_rating, inv_id, account_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `
  return await db.query(sql, [review_text, review_rating, inv_id, account_id])
}

async function getReviewsByVehicle(inv_id) {
  const sql = `
    SELECT r.*, a.account_firstname
    FROM review r
    JOIN account a ON r.account_id = a.account_id
    WHERE inv_id = $1
    ORDER BY review_date DESC
  `
  return (await db.query(sql, [inv_id])).rows
}

async function deleteReview(review_id) {
  const sql = "DELETE FROM review WHERE review_id = $1"
  return await db.query(sql, [review_id])
}

module.exports = { addReview, getReviewsByVehicle, deleteReview }
