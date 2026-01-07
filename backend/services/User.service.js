const Users = require("../model/User.model");
const bcrypt = require("bcrypt");

class UserService {
  static async getAllUsers() {
    try {
      return await Users.findAll();
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const user = await Users.findById(id);
      if (!user) {
        const error = new Error("Utilisateur non trouvé");
        error.status = 404;
        throw error;
      }
      return user;
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async getUserByEmail(email) {
    try {
      return await Users.findByEmail(email);
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async createUser({ email, password, name, role = "user" }) {
    try {
      const existingUser = await Users.findByEmail(email);
      if (existingUser) {
        const error = new Error("Email déjà utilisé");
        error.status = 409;
        throw error;
      }

      const password_hash = await bcrypt.hash(password, 10);
      return await Users.createOne({ email, password_hash, name, role });
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async validatePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }
}

module.exports = UserService;

