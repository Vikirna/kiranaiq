import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/common/Navbar'
import Loader from '../components/common/Loader'
import { getProducts, addProduct, deleteProduct, updateStock } from '../lib/api'
import { stagger, fadeUp, pageTransition, springPop } from '../lib/variants'
import VideoBackground from '../components/common/VideoBackground'

const Inventory = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingStock, setEditingStock] = useState(null)
  const [newStock, setNewStock] = useState('')
  const [form, setForm] = useState({
    name: '', category: '', current_stock: '',
    min_threshold: '', unit: '', price: ''
  })

  const fetchProducts = async () => {
    try {
      const res = await getProducts()
      setProducts(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await addProduct(form)
      setShowModal(false)
      setForm({ name: '', category: '', current_stock: '', min_threshold: '', unit: '', price: '' })
      fetchProducts()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      fetchProducts()
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateStock = async (id) => {
    try {
      await updateStock(id, { current_stock: newStock })
      setEditingStock(null)
      setNewStock('')
      fetchProducts()
    } catch (err) {
      console.error(err)
    }
  }

  const getStockColor = (product) => {
    const stock = parseFloat(product.current_stock)
    const threshold = parseFloat(product.min_threshold)
    if (stock <= threshold) return 'bg-red-100 text-red-700'
    if (stock <= threshold * 2) return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  const getStockLabel = (product) => {
    const stock = parseFloat(product.current_stock)
    const threshold = parseFloat(product.min_threshold)
    if (stock <= threshold) return 'Critical'
    if (stock <= threshold * 2) return 'Low'
    return 'Good'
  }

  if (loading) return <><Navbar /><Loader /></>

  return (
    <motion.div {...pageTransition} className="min-h-screen">
      <VideoBackground />
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div variants={stagger} initial="hidden" animate="visible">

          <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-kirana-dark"
              style={{ textShadow: '0 0 40px rgba(255,255,255,0.8), 0 2px 8px rgba(255,255,255,0.9)' }}
            >
              Inventory
            </h1>
            <motion.button
              {...springPop}
              onClick={() => setShowModal(true)}
              className="bg-kirana-brown text-white px-5 py-2 rounded-xl font-medium hover:bg-kirana-orange transition-colors"
            >
              + Add Product
            </motion.button>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <motion.div
                key={product.id}
                variants={fadeUp}
                {...springPop}
                className="bg-white rounded-2xl p-5 border border-kirana-earth/20 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-kirana-dark">{product.name}</h3>
                    <p className="text-sm text-kirana-earth">{product.category}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStockColor(product)}`}>
                    {getStockLabel(product)}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-kirana-earth">
                  <p>Stock: <span className="font-medium text-kirana-dark">{product.current_stock} {product.unit}</span></p>
                  <p>Min threshold: <span className="font-medium text-kirana-dark">{product.min_threshold} {product.unit}</span></p>
                  <p>Price: <span className="font-medium text-kirana-dark">₹{product.price}</span></p>
                </div>

                {/* Edit Stock + Remove */}
                <div className="mt-3 flex items-center gap-3">
                  {editingStock === product.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={newStock}
                        onChange={e => setNewStock(e.target.value)}
                        placeholder="New stock"
                        className="border border-kirana-earth/30 rounded-lg px-2 py-1 text-xs w-24 focus:outline-none focus:border-kirana-brown"
                      />
                      <button
                        onClick={() => handleUpdateStock(product.id)}
                        className="text-xs bg-kirana-brown text-white px-2 py-1 rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingStock(null)}
                        className="text-xs text-kirana-earth"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setEditingStock(product.id); setNewStock(product.current_stock) }}
                        className="text-xs text-kirana-brown hover:underline transition-colors"
                      >
                        Edit Stock
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {products.length === 0 && (
            <motion.div variants={fadeUp} className="text-center py-16 text-kirana-earth">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-lg font-medium">No products yet</p>
              <p className="text-sm">Add your first product to get started</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold text-kirana-dark mb-5">Add New Product</h2>
              <form onSubmit={handleAdd} className="space-y-3">
                {[
                  { key: 'name', label: 'Product Name', type: 'text' },
                  { key: 'category', label: 'Category', type: 'text' },
                  { key: 'current_stock', label: 'Current Stock', type: 'number' },
                  { key: 'min_threshold', label: 'Minimum Threshold', type: 'number' },
                  { key: 'unit', label: 'Unit (kg, pcs, litre)', type: 'text' },
                  { key: 'price', label: 'Price (₹)', type: 'number' },
                ].map(field => (
                  <input
                    key={field.key}
                    type={field.type}
                    placeholder={field.label}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    required
                    className="w-full border border-kirana-earth/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-kirana-brown"
                  />
                ))}
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-kirana-brown text-white py-2 rounded-xl font-medium hover:bg-kirana-orange transition-colors">
                    Add Product
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-kirana-earth/30 text-kirana-earth py-2 rounded-xl font-medium hover:bg-kirana-cream transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Inventory