const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { getPredictions, triggerPredictions } = require('../controllers/predictionController')

router.get('/', auth, getPredictions)
router.post('/run', auth, triggerPredictions)

module.exports = router