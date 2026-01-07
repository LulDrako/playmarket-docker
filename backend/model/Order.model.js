const { db } = require("../config/db.postgres");

class Orders {
  static async findAll() {
    try {
      const orders = await db.any(`
        SELECT o.*, u.email 
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `);
      return orders;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async findById(id) {
    try {
      const order = await db.oneOrNone(
        `
        SELECT o.*, u.email 
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = $1
      `,
        [id]
      );
      return order;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async findByUserId(userId) {
    try {
      const orders = await db.any(
        `
        SELECT * FROM orders 
        WHERE user_id = $1 
        ORDER BY created_at DESC
      `,
        [userId]
      );
      return orders;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async createOne({ user_id, total }) {
    try {
      const created = await db.one(
        "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
        [user_id, total || 0]
      );
      return created;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async updateTotal(id, total) {
    try {
      const updated = await db.one(
        "UPDATE orders SET total = $1 WHERE id = $2 RETURNING *",
        [total, id]
      );
      return updated;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }
}

module.exports = Orders;
