const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sendVerificationOTP, sendPasswordResetOTP } = require('../services/emailService')

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

const signup = async (req, res) => {
  const { shop_name, owner_name, email, password, city } = req.body

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }

  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = generateOTP()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await pool.query(
      `INSERT INTO users (shop_name, owner_name, email, password, city, otp, otp_expires, is_verified)
       VALUES ($1,$2,$3,$4,$5,$6,$7,FALSE)`,
      [shop_name, owner_name, email, hashedPassword, city, otp, otpExpires]
    )

    await sendVerificationOTP(email, otp, shop_name)

    res.status(201).json({
      success: true,
      message: 'OTP sent to your email'
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' })
    }

    const user = result.rows[0]

    if (user.is_verified) {
      return res.status(400).json({ message: 'Email already verified' })
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ message: 'OTP expired. Please sign up again.' })
    }

    await pool.query(
      'UPDATE users SET is_verified = TRUE, otp = NULL, otp_expires = NULL WHERE email = $1',
      [email]
    )

    res.json({ success: true, message: 'Email verified successfully! You can now log in.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' })
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const user = result.rows[0]

    if (!user.is_verified) {
      return res.status(400).json({
        message: 'Please verify your email first',
        needsVerification: true,
        email: user.email
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        shop_name: user.shop_name,
        owner_name: user.owner_name,
        email: user.email,
        city: user.city
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' })
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (result.rows.length === 0) {
      return res.json({ success: true, message: 'If that email exists, a reset code has been sent.' })
    }

    const otp = generateOTP()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000)

    await pool.query(
      'UPDATE users SET otp = $1, otp_expires = $2 WHERE email = $3',
      [otp, otpExpires, email]
    )

    await sendPasswordResetOTP(email, otp)

    res.json({ success: true, message: 'Reset code sent to your email.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' })
    }

    const user = result.rows[0]

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.query(
      'UPDATE users SET password = $1, otp = NULL, otp_expires = NULL WHERE email = $2',
      [hashedPassword, email]
    )

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, shop_name, owner_name, email, city FROM users WHERE id = $1',
      [req.user.id]
    )
    res.json({ success: true, user: result.rows[0] })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { signup, verifyOTP, login, forgotPassword, resetPassword, getMe }