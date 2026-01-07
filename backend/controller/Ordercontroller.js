const OrderService = require("../services/Order.service");

class OrdersController {
  static async getAll(req, res, next) {
    try {
      const orders = await OrderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  static async getByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const orders = await OrderService.getOrdersByUserId(userId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { user_id, items } = req.body;
      const order = await OrderService.createOrder({ user_id, items });
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrdersController;
