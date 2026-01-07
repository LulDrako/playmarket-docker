
import { Link } from 'react-router-dom'
import { Gamepad2, Github, Twitter, Facebook, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gaming-dark border-t border-gaming-purple/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="w-8 h-8 text-gaming-purple" />
              <span className="text-xl font-gaming font-bold text-gradient">
                PLAYMARKET
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Votre marketplace gaming ultime. Trouvez, achetez et jouez aux meilleurs jeux.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gaming-purple transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gaming-purple transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gaming-purple transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gaming-purple transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/games" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Tous les jeux
                </Link>
              </li>
            </ul>
          </div>

          {/* Spacer / Copyright */}
          <div className="md:col-span-2 flex items-end justify-end">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} PLAYMARKET. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

