import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { forgotPassword, resetPassword } from '../lib/api'
import { fadeUp, stagger } from '../lib/variants'

const ForgotPassword = () => {
  const [step, setStep] = useState(1) // 1=email, 2=otp+newpass
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    setLoading(true)
    setError('')
    try {
      await forgotPassword({ email })
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`reset-otp-${index + 1}`).focus()
    }
  }

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`reset-otp-${index - 1}`).focus()
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }
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
      await resetPassword({ email, otp: otpString, password })
      setSuccess(true)
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
          <div className="text-4xl mb-3">🔑</div>
          <h1 className="text-3xl font-bold text-kirana-dark">
            {step === 1 ? 'Forgot password?' : 'Reset password'}
          </h1>
          <p className="text-kirana-earth mt-1">
            {step === 1 ? "Enter your email and we'll send a reset code" : `Enter the code sent to ${email}`}
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="bg-white rounded-2xl p-8 border border-kirana-earth/20 shadow-sm">
          <AnimatePresence mode="wait">

            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                <div className="text-4xl mb-3">✅</div>
                <p className="font-medium text-kirana-dark mb-2">Password reset successfully!</p>
                <p className="text-sm text-kirana-earth mb-6">You can now log in with your new password.</p>
                <Link to="/login" className="bg-kirana-brown text-white px-6 py-2 rounded-xl font-medium hover:bg-kirana-orange transition-colors">
                  Go to Login
                </Link>
              </motion.div>
            ) : step === 1 ? (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSendOTP}
                className="space-y-4"
              >
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full border border-kirana-earth/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kirana-brown"
                />
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-kirana-brown text-white py-3 rounded-xl font-medium hover:bg-kirana-orange transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </motion.button>
                <p className="text-center text-sm text-kirana-earth">
                  <Link to="/login" className="text-kirana-brown font-medium hover:underline">Back to Login</Link>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleReset}
                className="space-y-4"
              >
                <div className="bg-kirana-cream rounded-xl p-3 text-center">
                  <p className="text-sm text-kirana-earth">
                    📧 Code sent to <span className="font-medium text-kirana-brown">{email}</span>
                  </p>
                </div>

                {/* OTP boxes */}
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`reset-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOTPChange(index, e.target.value)}
                      onKeyDown={e => handleOTPKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-kirana-earth/30 rounded-xl focus:outline-none focus:border-kirana-brown transition-colors"
                    />
                  ))}
                </div>

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

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-kirana-brown text-white py-3 rounded-xl font-medium hover:bg-kirana-orange transition-colors disabled:opacity-50"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </motion.button>

                <button
                  type="button"
                  onClick={() => { setStep(1); setError('') }}
                  className="w-full text-sm text-kirana-earth hover:text-kirana-brown transition-colors"
                >
                  ← Use different email
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword