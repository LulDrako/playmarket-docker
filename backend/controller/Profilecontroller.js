const ProfileService = require("../services/Profile.service");

class MongoController {
  static async getAllGameDetails(req, res, next) {
    try {
      const allDetails = await ProfileService.getAllGameDetails();
      res.json(allDetails);
    } catch (error) {
      next(error);
    }
  }

  static async getGameDetails(req, res, next) {
    try {
      const { gameId } = req.params;
      const details = await ProfileService.getGameDetails(parseInt(gameId));
      res.json(details);
    } catch (error) {
      next(error);
    }
  }

  static async createGameDetails(req, res, next) {
    try {
      const data = req.body;
      const details = await ProfileService.createGameDetails(data);
      res.status(201).json(details);
    } catch (error) {
      next(error);
    }
  }

  static async updateGameDetails(req, res, next) {
    try {
      const { gameId } = req.params;
      const data = req.body;
      const details = await ProfileService.updateGameDetails(
        parseInt(gameId),
        data
      );
      res.json(details);
    } catch (error) {
      next(error);
    }
  }

  static async getAllActivity(req, res, next) {
    try {
      const allLogs = await ProfileService.getAllActivity();
      res.json(allLogs);
    } catch (error) {
      next(error);
    }
  }

  static async logActivity(req, res, next) {
    try {
      const data = req.body;
      const log = await ProfileService.logActivity(data);
      res.status(201).json(log);
    } catch (error) {
      next(error);
    }
  }

  static async getUserActivity(req, res, next) {
    try {
      const { userId } = req.params;
      const logs = await ProfileService.getUserActivity(parseInt(userId));
      res.json(logs);
    } catch (error) {
      next(error);
    }
  }

  static async getAllRecommendations(req, res, next) {
    try {
      const allReco = await ProfileService.getAllRecommendations();
      res.json(allReco);
    } catch (error) {
      next(error);
    }
  }

  static async getRecommendations(req, res, next) {
    try {
      const { userId } = req.params;
      const reco = await ProfileService.getRecommendations(parseInt(userId));
      res.json(reco);
    } catch (error) {
      next(error);
    }
  }

  static async updateRecommendations(req, res, next) {
    try {
      const { userId } = req.params;
      const { items } = req.body;
      const reco = await ProfileService.updateRecommendations(
        parseInt(userId),
        items
      );
      res.json(reco);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MongoController;
