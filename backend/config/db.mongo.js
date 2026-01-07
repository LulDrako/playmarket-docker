const mongoose = require("mongoose");

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connecté à MongoDB");
    return true;
  } catch (error) {
    console.error("❌ Erreur MongoDB :", error.message);
    throw error;
  }
};

module.exports = connectMongoDB;
