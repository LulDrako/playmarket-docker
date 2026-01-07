import api from './api'

const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken)
      // refreshToken est maintenant dans un cookie sécurisé, pas besoin de localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken)
      // refreshToken est maintenant dans un cookie sécurisé, pas besoin de localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh')
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken)
        // Le nouveau refreshToken est automatiquement dans le cookie (rotation)
      }
      return response.data
    } catch (error) {
      // Si le refresh échoue, déconnecter l'utilisateur
      this.logout()
      throw error
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout') // Supprime le cookie refreshToken côté serveur
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // refreshToken est dans le cookie, sera supprimé par le serveur
  },

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  getToken() {
    return localStorage.getItem('token')
  },

  isAuthenticated() {
    return !!this.getToken()
  }
}

export default authService
