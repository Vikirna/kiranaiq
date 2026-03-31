const pool = require('../config/db')

const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const addProduct = async (req, res) => {
  const { name, category, current_stock, min_threshold, unit, price } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO products
       (name, category, current_stock, min_threshold, unit, price, user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, category, current_stock, min_threshold, unit, price, req.user.id]
    )
    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const updateProduct = async (req, res) => {
  const { id } = req.params
  const { name, category, current_stock, min_threshold, unit, price } = req.body
  try {
    const result = await pool.query(
      `UPDATE products SET name=$1, category=$2, current_stock=$3,
       min_threshold=$4, unit=$5, price=$6
       WHERE id=$7 AND user_id=$8 RETURNING *`,
      [name, category, current_stock, min_threshold, unit, price, id, req.user.id]
    )
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const deleteProduct = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query(
      'DELETE FROM products WHERE id=$1 AND user_id=$2',
      [id, req.user.id]
    )
    res.json({ success: true, message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getProducts, addProduct, updateProduct, deleteProduct }