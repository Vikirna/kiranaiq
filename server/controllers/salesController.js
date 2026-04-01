const pool = require('../config/db')

const getSales = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, p.name as product_name, p.unit
       FROM sales s JOIN products p ON s.product_id = p.id
       WHERE s.user_id = $1
       ORDER BY s.sale_date DESC`,
      [req.user.id]
    )
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const addSale = async (req, res) => {
  const { product_id, quantity_sold, sale_date, revenue } = req.body
  try {
    // Check stock availability
    const product = await pool.query(
      'SELECT current_stock FROM products WHERE id = $1 AND user_id = $2',
      [product_id, req.user.id]
    )
    
    if (product.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    
    if (parseFloat(product.rows[0].current_stock) <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot record sale — this product is out of stock!' 
      })
    }
    
    if (parseFloat(quantity_sold) > parseFloat(product.rows[0].current_stock)) {
      return res.status(400).json({ 
        success: false, 
        message: `Only ${product.rows[0].current_stock} units available in stock` 
      })
    }

    const result = await pool.query(
      `INSERT INTO sales (product_id, quantity_sold, sale_date, revenue, user_id)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [product_id, quantity_sold, sale_date, revenue, req.user.id]
    )
    await pool.query(
      `UPDATE products SET current_stock = current_stock - $1
       WHERE id = $2 AND user_id = $3`,
      [quantity_sold, product_id, req.user.id]
    )
    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getWeeklySales = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sale_date, SUM(revenue) as total_revenue,
       SUM(quantity_sold) as total_quantity
       FROM sales
       WHERE user_id = $1 AND sale_date >= NOW() - INTERVAL '7 days'
       GROUP BY sale_date ORDER BY sale_date ASC`,
      [req.user.id]
    )
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getSales, addSale, getWeeklySales }