const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { getSales, addSale, getWeeklySales, getOverallProfit } = require('../controllers/salesController')

router.get('/', auth, getSales)
router.post('/', auth, addSale)
router.get('/weekly', auth, getWeeklySales)
router.get('/overall-profit', auth, getOverallProfit)

module.exports = router