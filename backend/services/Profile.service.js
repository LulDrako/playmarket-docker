const MongoModels = require("../model/Profile.model");

class ProfileService {
  static async getAllGameDetails() {
    try {
      return await MongoModels.getAllGameDetails();
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async getGameDetails(gameId) {
    try {
      const details = await MongoModels.getGameDetails(gameId);
      if (!details) {
        const error = new Error("Détails du jeu non trouvés");
        error.status = 404;
        throw error;
      }
      return details;
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async createGameDetails(data) {
    try {
      return await MongoModels.createGameDetails(data);
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async updateGameDetails(gameId, data) {
    try {
      const details = await MongoModels.updateGameDetails(gameId, data);
      if (!details) {
        const error = new Error("Détails du jeu non trouvés");
        error.status = 404;
        throw error;
      }
      return details;
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async getAllActivity() {
    try {
      return await MongoModels.getAllActivity();
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async logActivity(data) {
    try {
      return await MongoModels.logActivity(data);
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async getUserActivity(userId) {
    try {
      return await MongoModels.getUserActivity(userId);
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async getAllRecommendations() {
    try {
      return await MongoModels.getAllRecommendations();
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async getRecommendations(userId) {
    try {
      const reco = await MongoModels.getRecommendations(userId);
      if (!reco) {
        const error = new Error("Recommandations non trouvées");
        error.status = 404;
        throw error;
      }
      return reco;
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }

  static async updateRecommendations(userId, items) {
    try {
      return await MongoModels.updateRecommendations(userId, items);
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }
}

module.exports = ProfileService;

