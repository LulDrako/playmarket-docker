const UserService = require("../services/User.service");

class UserController {
  static async getUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next) {
    try {
      const { email, password, role } = req.body;
      const user = await UserService.createUser({ email, password, role });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
