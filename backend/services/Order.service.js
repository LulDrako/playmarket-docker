const Orders = require("../model/Order.model");
const OrderItems = require("../model/OrderItem.model");

class OrderService {
  static async getAllOrders() {
    try {
      return await Orders.findAll();
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async getOrderById(id) {
    try {
      const order = await Orders.findById(id);
      if (!order) {
        const error = new Error("Commande non trouvée");
        error.status = 404;
        throw error;
      }
      const items = await OrderItems.findByOrderId(id);
      return { ...order, items };
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async getOrdersByUserId(userId) {
    try {
      return await Orders.findByUserId(userId);
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async createOrder({ user_id, items }) {
    try {
      if (!user_id || !items || items.length === 0) {
        const error = new Error("user_id et items requis");
        error.status = 400;
        throw error;
      }

      const total = items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );

      const order = await Orders.createOne({ user_id, total });

      for (const item of items) {
        await OrderItems.createOne({
          order_id: order.id,
          game_id: item.game_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        });
      }

      const orderItems = await OrderItems.findByOrderId(order.id);
      return { ...order, items: orderItems };
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }
}

module.exports = OrderService;

