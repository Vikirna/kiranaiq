const { getWeatherData } = require('../services/weatherService')
const { getFestivals } = require('../services/festivalService')

const getWeather = async (req, res) => {
  try {
    const data = await getWeatherData(req.query.city || 'Delhi')
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getUpcomingFestivals = async (req, res) => {
  try {
    const data = await getFestivals()
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getWeather, getUpcomingFestivals }