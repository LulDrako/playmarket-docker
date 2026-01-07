import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Search, Filter } from 'lucide-react'
import gamesService from '../services/games.service'
import { useCart } from '../contexts/CartContext'
import StarRating from '../components/common/StarRating'

export default function Games() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    try {
      const data = await gamesService.getAllGames()
      setGames(data)
    } catch (err) {
      setError('Erreur lors du chargement des jeux')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (game) => {
    addToCart(game)
  }

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-gaming font-bold mb-4">
            Catalogue de <span className="text-gradient">Jeux</span>
          </h1>
          <p className="text-gray-400">Découvrez notre sélection de jeux incroyables</p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher un jeu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gaming-dark/50 border border-gaming-purple/30 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-gaming-purple focus:ring-1 focus:ring-gaming-purple transition-all"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
          <button className="flex items-center gap-2 bg-gaming-dark/50 border border-gaming-purple/30 rounded-lg px-6 py-3 hover:border-gaming-purple transition-colors">
            <Filter className="w-5 h-5" />
            <span>Filtres</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game, index) => (
            <GameCard
              key={game.id}
              game={game}
              index={index}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredGames.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Aucun jeu trouvé</p>
          </div>
        )}
      </div>
    </div>
  )
}

function GameCard({ game, index, onAddToCart }) {
  const imageUrl = game.image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className="card-gaming group cursor-pointer overflow-hidden"
    >
      <Link to={`/games/${game.id}`}>
        <div className="relative h-48 rounded-lg mb-4 overflow-hidden">
          <img
            src={imageUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          {game.stock < 10 && game.stock > 0 && (
            <div className="absolute top-2 left-2 bg-yellow-500 px-3 py-1 rounded-full text-sm font-semibold">
              Stock limité
            </div>
          )}
          {game.stock === 0 && (
            <div className="absolute top-2 left-2 bg-red-500 px-3 py-1 rounded-full text-sm font-semibold">
              Rupture
            </div>
          )}
        </div>
      </Link>

      <Link to={`/games/${game.id}`}>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-gaming-purple transition-colors line-clamp-2">
          {game.title}
        </h3>
      </Link>

      <div className="flex items-center gap-2 mb-3">
        <StarRating rating={game.rating || 4.0} size="w-4 h-4" />
        <span className="text-sm text-gray-400">({game.rating || 4.0})</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gaming-purple">{game.price}€</p>
          <p className="text-xs text-gray-400">En stock: {game.stock}</p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            onAddToCart(game)
          }}
          disabled={game.stock === 0}
          className="bg-gaming-purple hover:bg-gaming-pink transition-colors px-4 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          Ajouter
        </button>
      </div>
    </motion.div>
  )
}

