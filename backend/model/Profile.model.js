const mongoose = require("mongoose");

const gameDetailsSchema = new mongoose.Schema(
  {
    gameId: { type: Number, required: true, unique: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    videos: [
      {
        title: String,
        url: String,
      },
    ],
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "gameDetails" }
);

const activityLogsSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true },
    event: { type: String, required: true },
    gameId: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "activityLogs" }
);

const recommendationsSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, unique: true },
    generatedAt: { type: Date, default: Date.now },
    items: [
      {
        gameId: { type: Number, required: true },
        score: { type: Number, required: true },
        reason: { type: String },
      },
    ],
  },
  { collection: "recommendations" }
);

const GameDetails = mongoose.model("GameDetails", gameDetailsSchema);
const ActivityLogs = mongoose.model("ActivityLogs", activityLogsSchema);
const Recommendations = mongoose.model(
  "Recommendations",
  recommendationsSchema
);

class MongoModels {
  static async getAllGameDetails() {
    try {
      const allDetails = await GameDetails.find();
      return allDetails;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async getGameDetails(gameId) {
    try {
      const details = await GameDetails.findOne({ gameId });
      return details;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async createGameDetails(data) {
    try {
      const details = new GameDetails(data);
      const saved = await details.save();
      return saved;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async updateGameDetails(gameId, data) {
    try {
      const updated = await GameDetails.findOneAndUpdate(
        { gameId },
        { ...data, updatedAt: new Date() },
        { new: true }
      );
      return updated;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async getAllActivity() {
    try {
      const allLogs = await ActivityLogs.find().sort({ createdAt: -1 });
      return allLogs;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async logActivity(data) {
    try {
      const log = new ActivityLogs(data);
      const saved = await log.save();
      return saved;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async getUserActivity(userId) {
    try {
      const logs = await ActivityLogs.find({ userId }).sort({ createdAt: -1 });
      return logs;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async getAllRecommendations() {
    try {
      const allReco = await Recommendations.find();
      return allReco;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async getRecommendations(userId) {
    try {
      const reco = await Recommendations.findOne({ userId });
      return reco;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async createRecommendations(data) {
    try {
      const reco = new Recommendations(data);
      const saved = await reco.save();
      return saved;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }

  static async updateRecommendations(userId, items) {
    try {
      const updated = await Recommendations.findOneAndUpdate(
        { userId },
        { items, generatedAt: new Date() },
        { new: true, upsert: true }
      );
      return updated;
    } catch (e) {
      console.log("Erreur : ", e);
      throw e;
    }
  }
}

module.exports = MongoModels;
