import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/common/Navbar'
import Loader from '../components/common/Loader'
import { getPredictions, runPredictions } from '../lib/api'
import { fadeUp, pageTransition, springPop } from '../lib/variants'
import VideoBackground from '../components/common/VideoBackground'

const Predictions = () => {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)

  const fetchPredictions = async () => {
    try {
      const res = await getPredictions()
      setPredictions(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPredictions() }, [])

  const handleRunPredictions = async () => {
    setRunning(true)
    setPredictions([])
    try {
      const res = await runPredictions()
      setPredictions(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setRunning(false)
    }
  }

  const getUrgencyColor = (days) => {
    if (days <= 3) return 'bg-red-100 text-red-700 border-red-200'
    if (days <= 7) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-green-100 text-green-700 border-green-200'
  }

  const getUrgencyLabel = (days) => {
    if (days <= 3) return 'Urgent'
    if (days <= 7) return 'Soon'
    return 'Stable'
  }

  if (loading) return <><Navbar /><Loader /></>

  return (
    <motion.div {...pageTransition} className="min-h-screen">
      <VideoBackground />
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-kirana-dark"
              style={{ textShadow: '0 0 40px rgba(255,255,255,0.8), 0 2px 8px rgba(255,255,255,0.9)' }}
            >
              AI Predictions
            </h1>
            <p className="text-kirana-dark font-semibold mt-1"
              style={{
                textShadow: '0 0 60px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,1)',
                filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.9))'
              }}
            >
              Powered by weather + festival + sales data
            </p>
          </div>
          <motion.button
            {...springPop}
            onClick={handleRunPredictions}
            disabled={running}
            className="bg-kirana-brown text-white px-5 py-2 rounded-xl font-medium hover:bg-kirana-orange transition-colors disabled:opacity-50"
          >
            {running ? '⏳ Analyzing your store...' : '🔮 Run Predictions'}
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {predictions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <p className="text-4xl mb-3">🔮</p>
              <p className="text-lg font-medium text-kirana-dark">
                {running ? 'Calculating predictions...' : 'No predictions yet'}
              </p>
              <p className="text-sm text-kirana-earth mt-1">
                Add products and sales data, then click Run Predictions
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="predictions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {predictions.map((pred, index) => {
                const daysLeft = Math.ceil(
                  (new Date(pred.predicted_stockout_date) - new Date()) / (1000 * 60 * 60 * 24)
                )
                return (
                  <motion.div
                    key={pred.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    {...springPop}
                    className={`bg-white rounded-2xl p-5 border shadow-sm ${getUrgencyColor(daysLeft)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg">{pred.product_name}</h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getUrgencyColor(daysLeft)}`}>
                        {getUrgencyLabel(daysLeft)}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>📦 Current stock: <span className="font-medium">{pred.current_stock} {pred.unit}</span></p>
                      <p>⏰ Stockout in: <span className="font-bold">{daysLeft} days</span></p>
                      <p>🛒 Recommended order: <span className="font-medium">{pred.recommended_quantity} {pred.unit}</span></p>
                      <p>🌤️ Weather: <span className="font-medium">{pred.weather_factor}</span></p>
                      {pred.festival_factor !== 'None' && (
                        <p>🎉 Festival boost: <span className="font-medium">{pred.festival_factor}</span></p>
                      )}
                      <p>📈 Trend: <span className="font-medium capitalize">{pred.price_trend}</span></p>
                      <p>✅ Confidence: <span className="font-medium">{pred.confidence_score}%</span></p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  )
}

export default Predictions