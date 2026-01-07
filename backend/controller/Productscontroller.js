const ProductsService = require("../services/Products.service");

class GamesController {
  static async getAll(req, res, next) {
    try {
      const games = await ProductsService.getAllGames();
      res.json(games);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const game = await ProductsService.getGameById(id);
      res.json(game);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { title, price, stock } = req.body;
      const game = await ProductsService.createGame({ title, price, stock });
      res.status(201).json(game);
    } catch (error) {
      next(error);
    }
  }

  static async updateStock(req, res, next) {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      const game = await ProductsService.updateGameStock(id, stock);
      res.json(game);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GamesController;
