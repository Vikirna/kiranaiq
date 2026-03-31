import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { login } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { fadeUp, stagger } from '../lib/variants'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await login(form)
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data?.needsVerification) {
        navigate(`/signup?email=${encodeURIComponent(data.email)}`)
      } else {
        setError(data?.message || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-kirana-light flex items-center justify-center px-4">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="text-4xl mb-3">🌾</div>
          <h1 className="text-3xl font-bold text-kirana-dark">Welcome back</h1>
          <p className="text-kirana-earth mt-1">Sign in to your KiranaIQ account</p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl p-8 border border-kirana-earth/20 shadow-sm"
        >
          {/* Verified success message */}
          {new URLSearchParams(window.location.search).get('verified') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-center"
            >
              <p className="text-green-700 text-sm font-medium">✅ Email verified! You can now log in.</p>
            </motion.div>
          )}

          {/* Demo credentials box */}
          <motion.div
            variants={fadeUp}
            className="bg-kirana-cream border border-kirana-brown/20 rounded-xl p-4 mb-6"
          >
            <p className="text-sm font-medium text-kirana-brown mb-1">Demo Account</p>
            <p className="text-xs text-kirana-earth">Email: demo@kiranaiq.com</p>
            <p className="text-xs text-kirana-earth">Password: demo1234</p>
            <button
              onClick={() => setForm({ email: 'demo@kiranaiq.com', password: 'demo1234' })}
              className="text-xs text-kirana-brown font-medium mt-2 hover:underline"
            >
              Click to fill demo credentials →
            </button>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="w-full border border-kirana-earth/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kirana-brown transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className="w-full border border-kirana-earth/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kirana-brown transition-colors"
            />
            <div className="text-right -mt-2">
              <Link to="/forgot-password" className="text-xs text-kirana-brown hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-kirana-brown text-white py-3 rounded-xl font-medium hover:bg-kirana-orange transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-kirana-earth mt-6">
            New shop owner?{' '}
            <Link to="/signup" className="text-kirana-brown font-medium hover:underline">
              Create account
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login