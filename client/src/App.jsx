import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Sales from './pages/Sales'
import Predictions from './pages/Predictions'
import ForgotPassword from './pages/ForgotPassword'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute><Inventory /></ProtectedRoute>
          } />
          <Route path="/sales" element={
            <ProtectedRoute><Sales /></ProtectedRoute>
          } />
          <Route path="/predictions" element={
            <ProtectedRoute><Predictions /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </Router>
  )
}

export default App