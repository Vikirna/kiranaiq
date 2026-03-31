const pool = require('../config/db')
const { getWeatherData } = require('./weatherService')
const { getFestivals } = require('./festivalService')

const runPredictions = async (userId) => {
  try {
    const products = await pool.query(
      'SELECT * FROM products WHERE user_id = $1',
      [userId]
    )
    const weather = await getWeatherData()
    const festivals = await getFestivals()

    // Delete old predictions for this user before inserting fresh ones
    await pool.query(
      'DELETE FROM predictions WHERE user_id = $1',
      [userId]
    )

    const predictions = []

    for (const product of products.rows) {
      const salesHistory = await pool.query(
        `SELECT quantity_sold, sale_date FROM sales
         WHERE product_id = $1 AND user_id = $2
         ORDER BY sale_date DESC LIMIT 30`,
        [product.id, userId]
      )

      if (salesHistory.rows.length < 3) continue

      // Average daily sales
      const totalSold = salesHistory.rows.reduce(
        (sum, s) => sum + parseFloat(s.quantity_sold), 0
      )
      const avgDailySales = totalSold / salesHistory.rows.length

      // Trend — compare last 7 days vs previous 7 days
      const last7 = salesHistory.rows.slice(0, 7)
      const prev7 = salesHistory.rows.slice(7, 14)
      const last7Avg = last7.reduce((s, r) => s + parseFloat(r.quantity_sold), 0) / (last7.length || 1)
      const prev7Avg = prev7.reduce((s, r) => s + parseFloat(r.quantity_sold), 0) / (prev7.length || 1)
      const trend = prev7Avg > 0 ? (last7Avg - prev7Avg) / prev7Avg : 0

      // Apply weather factor
      let adjustedSales = avgDailySales * (weather.demandFactor || 1)

      // Apply festival factor
      let festivalFactor = 'None'
      const relevantFestival = festivals.find(f =>
        f.demandItems.some(item =>
          product.name.toLowerCase().includes(item.toLowerCase())
        )
      )
      if (relevantFestival) {
        adjustedSales *= relevantFestival.demandFactor
        festivalFactor = relevantFestival.name
      }

      // Apply trend
      adjustedSales = adjustedSales * (1 + trend * 0.5)

      // Days until stockout
      const daysUntilStockout = adjustedSales > 0
        ? Math.floor(parseFloat(product.current_stock) / adjustedSales)
        : 999

      // Stockout date
      const stockoutDate = new Date()
      stockoutDate.setDate(stockoutDate.getDate() + daysUntilStockout)

      // Recommended quantity (30 day supply)
      const recommendedQty = Math.ceil(adjustedSales * 30)

      // Confidence score
      const confidence = Math.min(95, 50 + salesHistory.rows.length * 1.5)

      // Save prediction with user_id
      await pool.query(
        `INSERT INTO predictions
         (product_id, predicted_stockout_date, recommended_quantity,
          confidence_score, weather_factor, festival_factor, price_trend, user_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          product.id,
          stockoutDate.toISOString().split('T')[0],
          recommendedQty,
          confidence.toFixed(2),
          weather.condition,
          festivalFactor,
          trend > 0.1 ? 'rising' : trend < -0.1 ? 'falling' : 'stable',
          userId
        ]
      )

      predictions.push({
        product: product.name,
        daysUntilStockout,
        recommendedQty
      })
    }

    return predictions
  } catch (err) {
    console.error('Prediction engine error:', err)
    throw err
  }
}

module.exports = { runPredictions }