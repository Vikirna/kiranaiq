import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const VerifyEmail = () => {
  const [status, setStatus] = useState('loading')
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const statusParam = searchParams.get('status')
    const token = searchParams.get('token')
  
    if (statusParam === 'success') {
      setStatus('success')
      return
    }
  
    if (!token) {
      setStatus('error')
      return
    }
  
    // Call backend to verify
    fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setStatus('success')
        else setStatus('error')
      })
      .catch(() => setStatus('error'))
  }, [searchParams])

  return (
    <div className="min-h-screen bg-kirana-light flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-10 max-w-md w-full text-center border border-kirana-earth/20 shadow-sm"
      >
        {status === 'loading' && (
          <p className="text-kirana-earth">Verifying your email...</p>
        )}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-kirana-dark mb-2">Email verified!</h2>
            <p className="text-kirana-earth mb-6">
              Your account is now active. You can log in.
            </p>
            <Link
              to="/login"
              className="bg-kirana-brown text-white px-6 py-3 rounded-xl font-medium hover:bg-kirana-orange transition-colors"
            >
              Go to Login
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-kirana-dark mb-2">Invalid link</h2>
            <p className="text-kirana-earth mb-6">
              This verification link is invalid or has expired.
            </p>
            <Link to="/signup" className="text-kirana-brown font-medium hover:underline text-sm">
              Sign up again →
            </Link>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default VerifyEmail