const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getProducts, addProduct, updateProduct, deleteProduct
} = require('../controllers/productController')

router.get('/', auth, getProducts)
router.post('/', auth, addProduct)
router.put('/:id', auth, updateProduct)
router.delete('/:id', auth, deleteProduct)

module.exports = router