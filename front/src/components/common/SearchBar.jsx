import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import gamesService from '../../services/games.service'

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredGames, setFilteredGames] = useState([])
  const [allGames, setAllGames] = useState([])
  const dropdownRef = useRef(null)

  useEffect(() => {
    const loadGames = async () => {
      try {
        const games = await gamesService.getAllGames()
        setAllGames(games)
      } catch (err) {
        console.error(err)
      }
    }
    loadGames()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredGames([])
      setIsOpen(false)
    } else {
      const search = searchTerm.toLowerCase()
      
      const aliases = {
        'gta': 'grand theft auto',
        'rdr': 'red dead redemption',
        'lol': 'league of legends',
        'gow': 'god of war',
        'zelda': 'legend of zelda'
      }
      
      const filtered = allGames.filter(game => {
        const gameTitle = game.title.toLowerCase()
        
        if (gameTitle.includes(search)) return true
        
        for (const [alias, fullName] of Object.entries(aliases)) {
          if (search.includes(alias) && gameTitle.includes(fullName)) {
            return true
          }
        }
        
        return false
      })
      
      setFilteredGames(filtered.slice(0, 5))
      setIsOpen(filtered.length > 0)
    }
  }, [searchTerm, allGames])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClear = () => {
    setSearchTerm('')
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative flex-1 max-w-md mx-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un jeu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setIsOpen(true)}
          className="w-full bg-gaming-darker/50 border border-gaming-purple/30 rounded-lg px-4 py-2 pl-10 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-gaming-purple focus:ring-1 focus:ring-gaming-purple transition-all"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-gaming-dark border border-gaming-purple/30 rounded-lg shadow-2xl overflow-hidden z-50"
          >
            {filteredGames.map((game) => (
              <Link
                key={game.id}
                to={`/games/${game.id}`}
                onClick={handleClear}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gaming-purple/20 transition-colors border-b border-gaming-purple/10 last:border-b-0"
              >
                <img
                  src={game.image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'}
                  alt={game.title}
                  className="w-14 h-14 object-cover rounded"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'
                  }}
                />
                <div className="flex-1">
                  <p className="text-white font-medium line-clamp-1">{game.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gaming-purple font-bold">{game.price}€</p>
                    <span className="text-gray-500">•</span>
                    <p className="text-sm text-gray-400">⭐ {game.rating}</p>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

