const { db } = require("../config/db.postgres");

class Games {
  static async findAll() {
    try {
      const rows = await db.any("SELECT * FROM games");
      return rows;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async findById(id) {
    try {
      const game = await db.oneOrNone("SELECT * FROM games WHERE id = $1", [
        id,
      ]);
      return game;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async createOne({ title, price, stock }) {
    try {
      const created = await db.one(
        "INSERT INTO games (title, price, stock) VALUES ($1, $2, $3) RETURNING *",
        [title, price, stock || 0]
      );
      return created;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async updateStock(id, stock) {
    try {
      const updated = await db.one(
        "UPDATE games SET stock = $1 WHERE id = $2 RETURNING *",
        [stock, id]
      );
      return updated;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }
}

module.exports = Games;
