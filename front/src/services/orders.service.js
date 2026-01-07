import api from './api'

const ordersService = {
  async getAllOrders() {
    const response = await api.get('/orders')
    return response.data
  },

  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  async getUserOrders(userId) {
    const response = await api.get(`/orders/user/${userId}`)
    return response.data
  },

  async createOrder(orderData) {
    const response = await api.post('/orders', orderData)
    return response.data
  }
}

export default ordersService
