import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowLeft, Package, PlayCircle } from 'lucide-react'
import gamesService from '../services/games.service'
import { useCart } from '../contexts/CartContext'
import StarRating from '../components/common/StarRating'

export default function GameDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    loadGame()
  }, [id])

  const loadGame = async () => {
    try {
      const data = await gamesService.getGameById(id)
      setGame(data)
    } catch (err) {
      setError('Jeu non trouvé')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    addToCart(game)
  }

  const imageUrl = game?.image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'
  const description = game?.details?.description || 'Un jeu incroyable qui vous transportera dans un univers fantastique.'
  const tags = game?.details?.tags || ['Action', 'Aventure']
  const videos = game?.details?.videos || []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button onClick={() => navigate('/games')} className="btn-gaming">
            Retour au catalogue
          </button>
        </div>
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
          Retour au catalogue
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative h-96 rounded-xl overflow-hidden card-gaming"
            >
              <img
                src={imageUrl}
                alt={game.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </motion.div>

            {videos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-2xl font-gaming font-bold mb-4">
                  <span className="text-gradient">Trailers</span>
                </h3>
                <div className="space-y-3">
                  {videos.map((video, index) => (
                    <a
                      key={index}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-gaming p-4 group hover:scale-105 transition-transform cursor-pointer block"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gaming-purple to-gaming-pink flex items-center justify-center group-hover:animate-pulse flex-shrink-0">
                          <PlayCircle className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-semibold mb-1 group-hover:text-gradient transition-colors">
                            {video.title}
                          </h4>
                          <p className="text-sm text-gray-400">Regarder sur YouTube</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Game Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-gaming font-bold mb-4">{game.title}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={game.rating || 4.0} size="w-5 h-5" />
                <span className="text-gray-400">({game.rating || 4.0} / 5)</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Stock: {game.stock} unités</span>
                </div>
                {game.stock < 10 && game.stock > 0 && (
                  <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-semibold">
                    Stock limité
                  </span>
                )}
                {game.stock === 0 && (
                  <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-xs font-semibold">
                    Rupture de stock
                  </span>
                )}
              </div>
            </div>

            {/* Price and Add to Cart */}
            <div className="card-gaming p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Prix</p>
                  <p className="text-4xl font-bold text-gaming-purple">{game.price}€</p>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={game.stock === 0}
                className="w-full btn-gaming flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {game.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
              </button>
            </div>

            {/* Description */}
            <div className="card-gaming p-6">
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-gray-400 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="card-gaming p-6">
                <h3 className="text-xl font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gaming-purple/20 text-gaming-purple px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="card-gaming p-6">
              <h3 className="text-xl font-semibold mb-3">Informations</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gaming-purple rounded-full"></span>
                  Prix: {game.price}€
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gaming-purple rounded-full"></span>
                  Disponibilité: {game.stock > 0 ? `${game.stock} en stock` : 'Rupture de stock'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gaming-purple rounded-full"></span>
                  Livraison: Instantanée
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

