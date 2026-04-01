import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/common/Navbar'
import StatsCard from '../components/dashboard/StatsCard'
import Loader from '../components/common/Loader'
import { stagger, fadeUp, pageTransition } from '../lib/variants'
import VideoBackground from '../components/common/VideoBackground'
import { getProducts, getWeeklySales, getFestivals, getWeather, getOverallProfit } from '../lib/api'

const Dashboard = () => {
  const [products, setProducts] = useState([])
  const [weeklySales, setWeeklySales] = useState([])
  const [festivals, setFestivals] = useState([])
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [overallProfit, setOverallProfit] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, s, f, w, op] = await Promise.all([
          getProducts(),
          getWeeklySales(),
          getFestivals(),
          getWeather('Delhi'),
          getOverallProfit()
        ])
        setProducts(p.data.data)
        setWeeklySales(s.data.data)
        setFestivals(f.data.data)
        setWeather(w.data.data)
        setOverallProfit(op.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const lowStockItems = products.filter(
    p => parseFloat(p.current_stock) <= parseFloat(p.min_threshold)
  )

  const totalRevenue = weeklySales.reduce(
    (sum, s) => sum + parseFloat(s.total_revenue || 0), 0
  )

  if (loading) return <><Navbar /><Loader /></>

  return (
    <motion.div {...pageTransition} className="min-h-screen">
      <VideoBackground />
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">

        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.h1 variants={fadeUp} className="text-3xl font-bold text-kirana-dark mb-2"
            style={{ textShadow: '0 0 40px rgba(255,255,255,0.8), 0 2px 8px rgba(255,255,255,0.9)' }}
          >
            Dashboard
          </motion.h1>
          <motion.p variants={fadeUp} className="font-semibold mb-8 text-kirana-dark"
            style={{
              textShadow: '0 0 60px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,1)',
              filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.9))'
            }}
          >
            {weather && `🌤️ ${weather.temperature}°C · ${weather.condition} · Delhi`}
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
          >
            <StatsCard
              title="Total Products"
              value={products.length}
              icon="📦"
              color="bg-kirana-cream text-kirana-brown"
            />
            <StatsCard
              title="Low Stock Alerts"
              value={lowStockItems.length}
              icon="⚠️"
              color="bg-red-50 text-red-600"
            />
            <StatsCard
              title="Total Revenue"
              value={`₹${totalRevenue.toFixed(0)}`}
              icon="💰"
              color="bg-green-50 text-green-600"
            />
            <StatsCard
              title="Total Profit"
              value={`+₹${parseFloat(overallProfit?.total_gains || 0).toFixed(0)}`}
              icon="📈"
              color="bg-green-50 text-green-600"
            />
            <StatsCard
              title="Total Loss"
              value={`-₹${parseFloat(overallProfit?.total_losses || 0).toFixed(0)}`}
              icon="📉"
              color="bg-red-50 text-red-600"
            />
            <StatsCard
              title="Upcoming Festivals"
              value={festivals.length}
              icon="🎉"
              color="bg-orange-50 text-orange-600"
            />
          </motion.div>

          {/* Low Stock Alerts */}
          {lowStockItems.length > 0 && (
            <motion.div variants={fadeUp} className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
              <h2 className="text-lg font-bold text-red-700 mb-3">⚠️ Low Stock Alerts</h2>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map(item => (
                  <span key={item.id} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    {item.name} — {item.current_stock} {item.unit} left
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Upcoming Festivals */}
          {festivals.length > 0 && (
            <motion.div variants={fadeUp} className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
              <h2 className="text-lg font-bold text-kirana-orange mb-3">🎉 Upcoming Festivals — Stock Up!</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {festivals.map((f, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-orange-100">
                    <p className="font-bold text-kirana-dark">{f.name} — {f.daysUntil} days away</p>
                    <p className="text-sm text-kirana-earth mt-1">
                      Stock up on: {f.demandItems.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard