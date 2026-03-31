import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { signup, verifyOTP } from '../lib/api'
import { fadeUp, stagger } from '../lib/variants'

const Signup = () => {
  const [step, setStep] = useState(1) // 1 = form, 2 = otp
  const [form, setForm] = useState({
    shop_name: '', owner_name: '', email: '', password: '', city: ''
  })
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      await signup(form)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus()
    }
  }

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus()
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }
    setLoading(true)
    setError('')
    try {
      await verifyOTP({ email: form.email, otp: otpString })
      navigate('/login?verified=true')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError('')
    try {
      await signup(form)
      setOtp(['', '', '', '', '', ''])
    } catch (err) {
      setError('Failed to resend OTP')
    }
  }

  return (
    <div className="min-h-screen bg-kirana-light flex items-center justify-center px-4 py-8">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="text-4xl mb-3">🌾</div>
          <h1 className="text-3xl font-bold text-kirana-dark">
            {step === 1 ? 'Create account' : 'Verify your email'}
          </h1>
          <p className="text-kirana-earth mt-1">
            {step === 1
              ? 'Start managing your kirana store smarter'
              : `Enter the 6-digit code sent to ${form.email}`
            }
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl p-8 border border-kirana-earth/20 shadow-sm"
        >
          <AnimatePresence mode="wait">

            {/* Step 1 — Signup Form */}
            {step === 1 && (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSignup}
                className="space-y-4"
              >
                {[
                  { key: 'shop_name', placeholder: 'Shop Name (e.g. Sharma General Store)', type: 'text' },
                  { key: 'owner_name', placeholder: 'Your Name', type: 'text' },
                  { key: 'email', placeholder: 'Email Address', type: 'email' },
                  { key: 'password', placeholder: 'Password (min 6 characters)', type: 'password' },
                  { key: 'city', placeholder: 'City (e.g. Delhi, Mumbai)', type: 'text' },
                ].map(field => (
                  <input
                    key={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    required
                    className="w-full border border-kirana-earth/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kirana-brown transition-colors"
                  />
                ))}

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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
                  {loading ? 'Sending OTP...' : 'Continue'}
                </motion.button>

                <p className="text-center text-sm text-kirana-earth">
                  Already have an account?{' '}
                  <Link to="/login" className="text-kirana-brown font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </motion.form>
            )}

            {/* Step 2 — OTP Verification */}
            {step === 2 && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleVerify}
                className="space-y-6"
              >
                <div className="bg-kirana-cream rounded-xl p-4 text-center">
                  <p className="text-sm text-kirana-earth">
                    📧 Code sent to <span className="font-medium text-kirana-brown">{form.email}</span>
                  </p>
                </div>

                {/* OTP Input Boxes */}
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
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

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full bg-kirana-brown text-white py-3 rounded-xl font-medium hover:bg-kirana-orange transition-colors disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </motion.button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError('') }}
                    className="text-kirana-earth hover:text-kirana-brown transition-colors"
                  >
                    ← Change email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-kirana-brown font-medium hover:underline"
                  >
                    Resend OTP
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Signup