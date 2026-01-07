import api from './api'

const gamesService = {
  async getAllGames() {
    const response = await api.get('/games')
    return response.data
  },

  async getGameById(id) {
    const response = await api.get(`/games/${id}`)
    return response.data
  },

  async createGame(gameData) {
    const response = await api.post('/games', gameData)
    return response.data
  },

  async updateGameStock(id, stock) {
    const response = await api.patch(`/games/${id}/stock`, { stock })
    return response.data
  }
}

export default gamesService
