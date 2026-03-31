import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const links = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/inventory', label: 'Inventory' },
    { path: '/sales', label: 'Sales' },
    { path: '/predictions', label: 'Predictions' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border-b border-kirana-earth/20 px-6 py-4 flex items-center justify-between shadow-sm"
    >
      <Link to="/" className="text-xl font-bold text-kirana-brown">
        🌾 KiranaIQ
      </Link>

      <div className="flex gap-6">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-medium transition-colors duration-200 ${
              location.pathname === link.path
                ? 'text-kirana-brown border-b-2 border-kirana-brown pb-1'
                : 'text-kirana-earth hover:text-kirana-brown'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-kirana-earth">
            {user.shop_name}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="text-sm text-kirana-earth hover:text-red-500 transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </motion.nav>
  )
}

export default Navbar