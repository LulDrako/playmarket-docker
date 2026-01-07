const { db } = require("../config/db.postgres");

class OrderItems {
  static async findByOrderId(orderId) {
    try {
      const items = await db.any(
        `
        SELECT oi.*, g.title 
        FROM order_items oi
        LEFT JOIN games g ON oi.game_id = g.id
        WHERE oi.order_id = $1
      `,
        [orderId]
      );
      return items;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async createOne({ order_id, game_id, quantity, unit_price }) {
    try {
      const created = await db.one(
        "INSERT INTO order_items (order_id, game_id, quantity, unit_price) VALUES ($1, $2, $3, $4) RETURNING *",
        [order_id, game_id, quantity, unit_price]
      );
      return created;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async deleteByOrderId(orderId) {
    try {
      await db.none("DELETE FROM order_items WHERE order_id = $1", [orderId]);
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }
}

module.exports = OrderItems;
