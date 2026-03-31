import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { resetPassword } from '../lib/api'
import { fadeUp, stagger } from '../lib/variants'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      await resetPassword({ token, password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-kirana-light flex items-center justify-center px-4">
      <motion.div variants={stagger} initial="hidden" animate="visible" className="w-full max-w-md">
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-3xl font-bold text-kirana-dark">Set new password</h1>
          <p className="text-kirana-earth mt-1">Choose a strong password for your account</p>
        </motion.div>

        <motion.div variants={fadeUp} className="bg-white rounded-2xl p-8 border border-kirana-earth/20 shadow-sm">
          {success ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-medium text-kirana-dark mb-2">Password reset successfully!</p>
              <p className="text-sm text-kirana-earth">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="New password (min 6 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border border-kirana-earth/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kirana-brown"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                className="w-full border border-kirana-earth/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kirana-brown"
              />
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm text-center">
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
                {loading ? 'Resetting...' : 'Reset Password'}
              </motion.button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ResetPassword