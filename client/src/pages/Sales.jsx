import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/common/Navbar'
import Loader from '../components/common/Loader'
import { getSales, addSale, getProducts } from '../lib/api'
import { stagger, fadeUp, pageTransition, springPop } from '../lib/variants'
import VideoBackground from '../components/common/VideoBackground'

const Sales = () => {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    product_id: '', quantity_sold: '', sale_date: '', discount_percent: '0'
  })
  const [preview, setPreview] = useState(null)
  const [searchType, setSearchType] = useState('')
  const [searchDate, setSearchDate] = useState('')
  const [searchName, setSearchName] = useState('')
  const [filteredSales, setFilteredSales] = useState([])
  const [searched, setSearched] = useState(false)

  const fetchData = async () => {
    try {
      const [s, p] = await Promise.all([getSales(), getProducts()])
      setSales(s.data.data)
      setProducts(p.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // Auto-calculate preview whenever form changes
  useEffect(() => {
    if (!form.product_id || !form.quantity_sold) {
      setPreview(null)
      return
    }
    const product = products.find(p => p.id === parseInt(form.product_id))
    if (!product) return

    const qty = parseFloat(form.quantity_sold) || 0
    const discount = parseFloat(form.discount_percent) || 0
    const grossRevenue = parseFloat(product.price) * qty
    const discountAmount = grossRevenue * (discount / 100)
    const finalRevenue = grossRevenue - discountAmount
    const totalCost = parseFloat(product.cost_price || 0) * qty
    const profit = finalRevenue - totalCost

    setPreview({
      grossRevenue: grossRevenue.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      finalRevenue: finalRevenue.toFixed(2),
      profit: profit.toFixed(2),
      isProfit: profit >= 0
    })
  }, [form.product_id, form.quantity_sold, form.discount_percent, products])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addSale(form)
      setForm({ product_id: '', quantity_sold: '', sale_date: '', discount_percent: '0' })
      setPreview(null)
      setError('')
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record sale')
    }
  }

  const handleSearch = () => {
    if (searchType === 'date') {
      setFilteredSales(sales.filter(s => s.sale_date?.split('T')[0] === searchDate))
    } else if (searchType === 'name') {
      setFilteredSales(sales.filter(s =>
        s.product_name?.toLowerCase().includes(searchName.toLowerCase())
      ))
    }
    setSearched(true)
  }

  const handleClearSearch = () => {
    setSearchType('')
    setSearchDate('')
    setSearchName('')
    setFilteredSales([])
    setSearched(false)
  }

  if (loading) return <><Navbar /><Loader /></>

  return (
    <motion.div {...pageTransition} className="min-h-screen">
      <VideoBackground />
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.h1
            variants={fadeUp}
            className="text-3xl font-bold text-kirana-dark mb-8"
            style={{ textShadow: '0 0 40px rgba(255,255,255,0.8), 0 2px 8px rgba(255,255,255,0.9)' }}
          >
            Sales Entry
          </motion.h1>

          {/* Sales Form */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 border border-kirana-earth/20 shadow-sm mb-8">
            <h2 className="text-lg font-bold text-kirana-dark mb-4">Record a Sale</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <select
                value={form.product_id}
                onChange={e => { setForm({ ...form, product_id: e.target.value }); setError('') }}
                required
                className="border border-kirana-earth/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-kirana-brown"
              >
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ₹{p.price}/{p.unit} (stock: {p.current_stock})
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Quantity Sold"
                value={form.quantity_sold}
                onChange={e => setForm({ ...form, quantity_sold: e.target.value })}
                required
                min="0.01"
                step="0.01"
                className="border border-kirana-earth/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-kirana-brown"
              />

              <input
                type="date"
                value={form.sale_date}
                onChange={e => setForm({ ...form, sale_date: e.target.value })}
                required
                className="border border-kirana-earth/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-kirana-brown"
              />

              <div className="relative">
                <input
                  type="number"
                  placeholder="Discount % (0 = no discount)"
                  value={form.discount_percent}
                  onChange={e => setForm({ ...form, discount_percent: e.target.value })}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full border border-kirana-earth/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-kirana-brown"
                />
              </div>

              {/* Live Preview */}
              {preview && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="md:col-span-2 bg-kirana-cream border border-kirana-earth/20 rounded-xl p-4"
                >
                  <p className="text-xs font-medium text-kirana-earth mb-2">📊 Sale Preview</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-kirana-earth text-xs">Gross Revenue</p>
                      <p className="font-bold text-kirana-dark">₹{preview.grossRevenue}</p>
                    </div>
                    {parseFloat(preview.discountAmount) > 0 && (
                      <div>
                        <p className="text-kirana-earth text-xs">Discount</p>
                        <p className="font-bold text-orange-500">-₹{preview.discountAmount}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-kirana-earth text-xs">Final Revenue</p>
                      <p className="font-bold text-kirana-brown">₹{preview.finalRevenue}</p>
                    </div>
                    <div>
                      <p className="text-kirana-earth text-xs">Profit / Loss</p>
                      <p className={`font-bold ${preview.isProfit ? 'text-green-600' : 'text-red-500'}`}>
                        {preview.isProfit ? '+' : ''}₹{preview.profit}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="md:col-span-2 text-red-600 text-sm text-center bg-red-50 border border-red-200 p-3 rounded-xl"
                >
                  ⚠️ {error}
                </motion.p>
              )}

              <motion.button
                {...springPop}
                type="submit"
                className="md:col-span-2 bg-kirana-brown text-white py-2 rounded-xl font-medium hover:bg-kirana-orange transition-colors"
              >
                Record Sale
              </motion.button>
            </form>
          </motion.div>

          {/* Search Section */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 border border-kirana-earth/20 shadow-sm mb-8">
            <h2 className="text-lg font-bold text-kirana-dark mb-4">Search Sales</h2>
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => { setSearchType('date'); setSearchName(''); setSearched(false) }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  searchType === 'date' ? 'bg-kirana-brown text-white' : 'border border-kirana-earth/30 text-kirana-earth hover:bg-kirana-cream'
                }`}
              >
                📅 Search by Date
              </button>
              <button
                onClick={() => { setSearchType('name'); setSearchDate(''); setSearched(false) }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  searchType === 'name' ? 'bg-kirana-brown text-white' : 'border border-kirana-earth/30 text-kirana-earth hover:bg-kirana-cream'
                }`}
              >
                🔍 Search by Item
              </button>
              {searched && (
                <button onClick={handleClearSearch} className="px-4 py-2 rounded-xl text-sm font-medium border border-red-200 text-red-400 hover:bg-red-50 transition-colors">
                  ✕ Clear
                </button>
              )}
            </div>

            <AnimatePresence>
              {searchType === 'date' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex gap-3 items-center">
                  <input type="date" value={searchDate} onChange={e => setSearchDate(e.target.value)} className="border border-kirana-earth/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-kirana-brown" />
                  <button onClick={handleSearch} disabled={!searchDate} className="bg-kirana-brown text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-kirana-orange transition-colors disabled:opacity-50">Search</button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {searchType === 'name' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex gap-3 items-center">
                  <select value={searchName} onChange={e => setSearchName(e.target.value)} className="border border-kirana-earth/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-kirana-brown w-64">
                    <option value="">Select item...</option>
                    {[...new Set(sales.map(s => s.product_name))].filter(Boolean).sort().map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <button onClick={handleSearch} disabled={!searchName} className="bg-kirana-brown text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-kirana-orange transition-colors disabled:opacity-50">Search</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sales History */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 border border-kirana-earth/20 shadow-sm">
            <h2 className="text-lg font-bold text-kirana-dark mb-4">
              {searched ? `Results (${filteredSales.length} found)` : 'Sales History'}
            </h2>
            {(searched ? filteredSales : sales).length === 0 ? (
              <p className="text-kirana-earth text-center py-8">
                {searched ? 'No sales found' : 'No sales recorded yet'}
              </p>
            ) : (
              <div className="space-y-2">
                {(searched ? filteredSales : sales).map(sale => {
                  const profit = parseFloat(sale.profit || 0)
                  const isProfit = profit >= 0
                  return (
                    <motion.div key={sale.id} variants={fadeUp} className="flex items-center justify-between p-3 bg-kirana-light rounded-xl">
                      <div>
                        <p className="font-medium text-kirana-dark">{sale.product_name}</p>
                        <p className="text-xs text-kirana-earth">{sale.sale_date?.split('T')[0]}</p>
                        {parseFloat(sale.discount_percent) > 0 && (
                          <p className="text-xs text-orange-500">{sale.discount_percent}% discount applied</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-kirana-dark">{sale.quantity_sold} {sale.unit}</p>
                        <p className="text-sm text-kirana-brown font-medium">₹{parseFloat(sale.final_revenue || sale.revenue).toFixed(2)}</p>
                        <p className={`text-xs font-medium ${isProfit ? 'text-green-600' : 'text-red-500'}`}>
                          {isProfit ? '▲' : '▼'} ₹{Math.abs(profit).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  )
}

export default Sales