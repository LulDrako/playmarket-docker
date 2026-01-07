import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Zap, TrendingUp, Gift, ShoppingCart } from 'lucide-react'
import gamesService from '../services/games.service'
import { useCart } from '../contexts/CartContext'
import StarRating from '../components/common/StarRating'

export default function Home() {
  const [topGames, setTopGames] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    loadTopGames()
  }, [])

  const loadTopGames = async () => {
    try {
      const allGames = await gamesService.getAllGames()
      const sorted = allGames.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      setTopGames(sorted.slice(0, 3))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-gaming-purple/20 rounded-full blur-3xl -top-48 -left-48 animate-float" />
          <div className="absolute w-96 h-96 bg-gaming-pink/20 rounded-full blur-3xl -bottom-48 -right-48 animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-gaming font-bold">
              Bienvenue sur{' '}
              <span className="text-gradient">PLAYMARKET</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Découvrez les meilleurs jeux, les meilleures offres et rejoignez la plus grande communauté gaming
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/games" className="btn-gaming text-lg px-8 py-4">
                Explorer les jeux
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gaming-dark/30">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-gaming font-bold text-center mb-12"
          >
            Pourquoi choisir <span className="text-gradient">PLAYMARKET</span> ?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Qualité Premium"
              description="Des jeux soigneusement sélectionnés et vérifiés"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Livraison Instantanée"
              description="Accédez à vos jeux immédiatement après l'achat"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Meilleurs Prix"
              description="Des prix imbattables et des offres exclusives"
            />
            <FeatureCard
              icon={<Gift className="w-8 h-8" />}
              title="Récompenses"
              description="Gagnez des points à chaque achat"
            />
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-gaming font-bold">
              Jeux en <span className="text-gradient">Vedette</span>
            </h2>
            <Link to="/games" className="text-gaming-purple hover:text-gaming-pink transition-colors">
              Voir tout →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-purple"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topGames.map((game, index) => (
                <GameCard key={game.id} game={game} index={index} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="card-gaming text-center space-y-4"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gaming-purple to-gaming-pink rounded-lg text-white">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}

function GameCard({ game, index, onAddToCart }) {
  const imageUrl = game.image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ scale: 1.03 }}
      className="card-gaming group cursor-pointer overflow-hidden"
    >
      <Link to={`/games/${game.id}`}>
        <div className="relative h-56 rounded-lg mb-4 overflow-hidden">
          <img
            src={imageUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute top-2 right-2 bg-gaming-pink px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            ⭐ {game.rating}
          </div>
        </div>
      </Link>
      
      <Link to={`/games/${game.id}`}>
        <h3 className="text-xl font-semibold mb-3 group-hover:text-gaming-purple transition-colors line-clamp-2">
          {game.title}
        </h3>
      </Link>

      <div className="flex items-center gap-2 mb-3">
        <StarRating rating={game.rating || 4.0} size="w-4 h-4" />
        <span className="text-sm text-gray-400">({game.rating})</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-gaming-purple">{game.price}€</p>
          <p className="text-xs text-gray-400">En stock: {game.stock}</p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            onAddToCart(game)
          }}
          disabled={game.stock === 0}
          className="bg-gaming-purple hover:bg-gaming-pink transition-colors px-4 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4" />
          Ajouter
        </button>
      </div>
    </motion.div>
  )
}

