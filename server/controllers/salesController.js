const pool = require('../config/db')

const getSales = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, p.name as product_name, p.unit
       FROM sales s JOIN products p ON s.product_id = p.id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [req.user.id]
    )
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const addSale = async (req, res) => {
  const { product_id, quantity_sold, sale_date, discount_percent = 0 } = req.body
  try {
    const product = await pool.query(
      'SELECT current_stock, price, cost_price FROM products WHERE id = $1 AND user_id = $2',
      [product_id, req.user.id]
    )

    if (product.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const { current_stock, price, cost_price } = product.rows[0]

    if (parseFloat(current_stock) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot record sale — this product is out of stock!'
      })
    }

    if (parseFloat(quantity_sold) > parseFloat(current_stock)) {
      return res.status(400).json({
        success: false,
        message: `Only ${current_stock} units available in stock`
      })
    }

    const grossRevenue = parseFloat(price) * parseFloat(quantity_sold)
    const discountAmount = grossRevenue * (parseFloat(discount_percent) / 100)
    const finalRevenue = grossRevenue - discountAmount
    const totalCost = parseFloat(cost_price || 0) * parseFloat(quantity_sold)
    const profit = finalRevenue - totalCost

    const result = await pool.query(
      `INSERT INTO sales (product_id, quantity_sold, sale_date, revenue, discount_percent, final_revenue, profit, user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [product_id, quantity_sold, sale_date, finalRevenue, discount_percent, finalRevenue, profit, req.user.id]
    )

    await pool.query(
      `UPDATE products SET current_stock = current_stock - $1 WHERE id = $2 AND user_id = $3`,
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
      `SELECT sale_date, SUM(COALESCE(final_revenue, revenue)) as total_revenue,
       SUM(quantity_sold) as total_quantity,
       SUM(COALESCE(profit, 0)) as total_profit
       FROM sales
       WHERE user_id = $1
       GROUP BY sale_date ORDER BY sale_date ASC`,
      [req.user.id]
    )
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getOverallProfit = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        SUM(COALESCE(final_revenue, revenue)) as total_revenue,
        SUM(COALESCE(profit, 0)) as total_profit,
        SUM(CASE WHEN COALESCE(profit, 0) > 0 THEN COALESCE(profit, 0) ELSE 0 END) as total_gains,
        SUM(CASE WHEN COALESCE(profit, 0) < 0 THEN ABS(COALESCE(profit, 0)) ELSE 0 END) as total_losses
       FROM sales WHERE user_id = $1`,
      [req.user.id]
    )
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getSales, addSale, getWeeklySales, getOverallProfit }