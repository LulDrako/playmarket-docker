import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart, User, Search, Gamepad2, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import SearchBar from '../common/SearchBar'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { getCartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const displayName = user?.name ? capitalize(user.name) : user?.email?.split('@')[0]
  const showSearchBar = location.pathname === '/'

  return (
    <nav className="sticky top-0 z-50 bg-gaming-dark/80 backdrop-blur-md border-b border-gaming-purple/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Gamepad2 className="w-8 h-8 text-gaming-purple group-hover:animate-pulse" />
              <div className="absolute inset-0 bg-gaming-purple/20 blur-xl group-hover:bg-gaming-purple/40 transition-all" />
            </div>
            <span className="text-2xl font-gaming font-bold text-gradient">
              PLAYMARKET
            </span>
          </Link>

          {showSearchBar && (
            <div className="hidden md:flex">
              <SearchBar />
            </div>
          )}


          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile"
                  className="flex items-center gap-3 bg-gaming-dark/50 backdrop-blur-sm border border-gaming-purple/30 rounded-lg px-4 py-2 hover:border-gaming-purple/60 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-pink flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                    {displayName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium group-hover:text-gradient transition-colors">{displayName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="btn-gaming">
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 space-y-4"
          >
            {showSearchBar && (
              <div className="mb-4">
                <SearchBar />
              </div>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 bg-gaming-dark/50 border border-gaming-purple/30 rounded-lg px-4 py-3 mb-4 hover:border-gaming-purple/60 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-pink flex items-center justify-center text-white font-bold text-lg">
                    {displayName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium">{displayName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-300 hover:text-white transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="w-full btn-gaming block text-center">
                  S&apos;inscrire
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  )
}

