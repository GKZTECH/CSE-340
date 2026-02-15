const pool = require("../database/");

async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error);
    return [];
  }
}

async function getInventoryById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.inv_id = $1`,
      [inventory_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryById error: " + error);
    return [];
  }
}

// Add new classification
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    console.error("addClassification error: " + error);
    
    // Check for duplicate classification name
    if (error.code === '23505') { // Unique violation
      throw new Error('Classification name already exists');
    }
    
    throw error;
  }
}

async function getReviewsByInvId(invId) {
    try {
        const sql = `
            SELECT r.*, a.account_firstname, a.account_lastname
            FROM reviews r
            JOIN accounts a ON r.account_id = a.account_id
            WHERE r.inv_id = $1
            ORDER BY r.review_date DESC
        `;
        const result = await pool.query(sql, [invId]);
        return result.rows;
    } catch (error) {
        console.error('getReviewsByInvId error:', error);
        return [];
    }
}

/**
 * Add a new review.
 */
async function addReview(invId, accountId, reviewText) {
    try {
        const sql = `
            INSERT INTO reviews (inv_id, account_id, review_text)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await pool.query(sql, [invId, accountId, reviewText]);
        return result.rows[0];
    } catch (error) {
        console.error('addReview error:', error);
        throw error;
    }
}

// Add new inventory item
async function addInventory({
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
}) {
  try {
    const sql = `INSERT INTO inventory (
      inv_make, inv_model, inv_year, inv_description, 
      inv_image, inv_thumbnail, inv_price, inv_miles, 
      inv_color, classification_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    
    const result = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      parseFloat(inv_price),
      parseInt(inv_miles),
      inv_color,
      parseInt(classification_id)
    ]);
    
    return result.rows[0];
  } catch (error) {
    console.error("addInventory error: " + error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  getReviewsByInvId,
  addReview,
};