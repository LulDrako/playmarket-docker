import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-pink flex items-center justify-center text-white font-bold text-4xl">
            {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-4xl font-gaming font-bold mb-2">
            Mon <span className="text-gradient">Profil</span>
          </h1>
          <p className="text-gray-400">Gérez vos informations personnelles</p>
        </motion.div>

        <div className="card-gaming p-8">
          <h2 className="text-2xl font-semibold mb-6">Informations</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm">Nom</label>
              <p className="text-white text-lg">{user?.name || 'Non renseigné'}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Email</label>
              <p className="text-white text-lg">{user?.email}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Rôle</label>
              <p className="text-white text-lg capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

