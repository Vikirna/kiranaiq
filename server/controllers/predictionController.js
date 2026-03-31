const pool = require('../config/db')
const { runPredictions } = require('../services/predictionEngine')

const getPredictions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pr.*, p.name as product_name, p.unit, p.current_stock
       FROM predictions pr JOIN products p ON pr.product_id = p.id
       ORDER BY pr.created_at DESC`
    )
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const triggerPredictions = async (req, res) => {
  try {
    const predictions = await runPredictions(req.user.id)
    
    // Fetch the saved predictions and return them directly
    const result = await pool.query(
      `SELECT pr.*, p.name as product_name, p.unit, p.current_stock
       FROM predictions pr JOIN products p ON pr.product_id = p.id
       WHERE pr.user_id = $1
       ORDER BY pr.created_at DESC`,
      [req.user.id]
    )
    
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getPredictions, triggerPredictions }