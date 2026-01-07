import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import ordersService from '../services/orders.service'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setLoading(true)
    setError('')

    try {
      const orderData = {
        user_id: user.id,
        items: cart.map(item => ({
          game_id: item.id,
          quantity: item.quantity,
          unit_price: item.price
        }))
      }

      await ordersService.createOrder(orderData)
      clearCart()
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la commande')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-600" />
          <h2 className="text-3xl font-gaming font-bold mb-4">Votre panier est vide</h2>
          <p className="text-gray-400 mb-8">Découvrez notre catalogue et ajoutez des jeux !</p>
          <Link to="/games" className="btn-gaming inline-block">
            Voir les jeux
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/games')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Continuer mes achats
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-gaming font-bold mb-2">
            Mon <span className="text-gradient">Panier</span>
          </h1>
          <p className="text-gray-400">{getCartCount()} article(s) dans votre panier</p>
        </motion.div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <CartItem
                key={item.id}
                item={item}
                index={index}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-gaming p-6 sticky top-24">
              <h3 className="text-2xl font-semibold mb-6">Récapitulatif</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Sous-total ({getCartCount()} articles)</span>
                  <span>{getCartTotal().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Livraison</span>
                  <span className="text-green-500">Gratuite</span>
                </div>
                <div className="border-t border-gaming-purple/20 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-gaming-purple">{getCartTotal().toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full btn-gaming mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Traitement...' : 'Valider la commande'}
              </button>

              {!isAuthenticated && (
                <p className="text-sm text-gray-400 text-center">
                  Vous devez être connecté pour commander
                </p>
              )}

              <button
                onClick={clearCart}
                className="w-full mt-2 bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500/10 font-semibold px-6 py-3 rounded-lg transition-all"
              >
                Vider le panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartItem({ item, index, onRemove, onUpdateQuantity }) {
  const imageUrl = item.image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-gaming p-4 flex items-center gap-4"
    >
      {/* Game Image */}
      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'
          }}
        />
      </div>

      {/* Game Info */}
      <div className="flex-1">
        <Link to={`/games/${item.id}`}>
          <h3 className="font-semibold text-lg hover:text-gaming-purple transition-colors mb-1">
            {item.title}
          </h3>
        </Link>
        <p className="text-2xl font-bold text-gaming-purple">{item.price}€</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 bg-gaming-dark hover:bg-gaming-purple/20 rounded-lg flex items-center justify-center transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-12 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={item.quantity >= item.stock}
          className="w-8 h-8 bg-gaming-dark hover:bg-gaming-purple/20 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-[100px]">
        <p className="text-lg font-bold">{(item.price * item.quantity).toFixed(2)}€</p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </motion.div>
  )
}

