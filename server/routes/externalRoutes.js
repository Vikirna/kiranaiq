const express = require('express')
const router = express.Router()
const { getWeather, getUpcomingFestivals } = require('../controllers/externalController')

router.get('/weather', getWeather)
router.get('/festivals', getUpcomingFestivals)

module.exports = router