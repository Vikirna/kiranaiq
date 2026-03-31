const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { getSales, addSale, getWeeklySales } = require('../controllers/salesController')

router.get('/', auth, getSales)
router.post('/', auth, addSale)
router.get('/weekly', auth, getWeeklySales)

module.exports = router