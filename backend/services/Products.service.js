const Games = require("../model/Products.model");
const MongoModels = require("../model/Profile.model");

class ProductsService {
  static async getAllGames() {
    try {
      const games = await Games.findAll();
      const enrichedGames = await Promise.all(
        games.map(async (game) => {
          try {
            const details = await MongoModels.getGameDetails(game.id);
            return details ? { ...game, details } : game;
          } catch (err) {
            return game;
          }
        })
      );
      return enrichedGames;
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async getGameById(id) {
    try {
      const game = await Games.findById(id);
      if (!game) {
        const error = new Error("Jeu non trouvé");
        error.status = 404;
        throw error;
      }
      try {
        const details = await MongoModels.getGameDetails(id);
        return details ? { ...game, details } : game;
      } catch (err) {
        return game;
      }
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async createGame({ title, price, stock }) {
    try {
      if (!title || price === undefined) {
        const error = new Error("Title et price requis");
        error.status = 400;
        throw error;
      }
      return await Games.createOne({ title, price, stock });
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async updateGameStock(id, stock) {
    try {
      if (stock === undefined) {
        const error = new Error("Stock requis");
        error.status = 400;
        throw error;
      }
      const game = await Games.updateStock(id, stock);
      if (!game) {
        const error = new Error("Jeu non trouvé");
        error.status = 404;
        throw error;
      }
      return game;
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }
}

module.exports = ProductsService;

