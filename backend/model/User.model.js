const { db } = require("../config/db.postgres");

class Users {
  static async findAll() {
    try {
      const query = await db.any("SELECT id, email, name, role FROM users");
      return query;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async findById(id) {
    try {
      const user = await db.oneOrNone(
        "SELECT id, email, name, role FROM users WHERE id = $1",
        [id]
      );
      return user;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async createOne({ email, password_hash, name, role = "user" }) {
    try {
      const query_create = await db.one(
        "INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role",
        [email, password_hash, name, role]
      );
      return query_create;
    } catch (e) {
      if (e.code === "23505") {
        const err = new Error("Email déjà utilisé");
        err.status = 409;
        throw err;
      }
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async findByEmail(email) {
    try {
      const user = await db.oneOrNone(
        "SELECT id, email, name, password_hash, role, created_at FROM users WHERE email = $1",
        [email]
      );
      return user;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }
}

module.exports = Users;
