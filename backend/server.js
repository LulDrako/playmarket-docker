// Charger le .env depuis la racine du projet
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const https = require("https");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger.config");
const connectMongoDB = require("./config/db.mongo");
const { connectPostgreSQL } = require("./config/db.postgres");
const { errorHandler, notFoundHandler } = require("./middlewares/error.middleware");

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

const initializeDatabases = async () => {
  try {
    await connectMongoDB();
    await connectPostgreSQL();
  } catch (error) {
    console.error("❌ Erreur base de données:", error.message);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  }
};

// ============================================
// SÉCURITÉ DES COMMUNICATIONS
// ============================================

// Configuration Helmet pour les headers HTTP de sécurité
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: isProduction
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
    hidePoweredBy: true,
    frameguard: { action: "deny" },
    xssFilter: true,
    noSniff: true,
    dnsPrefetchControl: true,
    crossOriginResourcePolicy: isDevelopment
      ? { policy: "cross-origin" }
      : { policy: "same-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

// Configuration CORS maîtrisée
app.use((req, res, next) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
    : isDevelopment
    ? ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"]
    : [];

  const origin = req.headers.origin;

  if (isDevelopment && origin && origin.includes("localhost")) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  } else if (isProduction && origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  } else if (!origin) {
    // Pas d'origine = requête same-origin, OK
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token"
  );
  res.header("Access-Control-Expose-Headers", "X-Total-Count");
  res.header("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
  message: {
    error: "Trop de requêtes, veuillez réessayer plus tard",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
});

app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 5 : 100,
  message: {
    error: "Trop de tentatives de connexion, veuillez réessayer plus tard",
  },
  skip: () => process.env.NODE_ENV === "test",
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    database: "connected",
    version: "1.0.0",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const authRoutes = require("./routes/auth.Routes");
app.use("/api/auth", authLimiter, authRoutes);

const gamesRoutes = require("./routes/products.Routes");
app.use("/api/games", gamesRoutes);

const userRoutes = require("./routes/user.Routes");
app.use("/api/users", userRoutes);

const mongoRoutes = require("./routes/profile.Routes");
app.use("/api/mongo", mongoRoutes);

const orderRoutes = require("./routes/order.Routes");
app.use("/api/orders", orderRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// DÉMARRAGE DU SERVEUR (HTTP/HTTPS)
// ============================================

const startServer = async () => {
  await initializeDatabases();

  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (isProduction && process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
    try {
      const keyPath = path.resolve(__dirname, "..", process.env.SSL_KEY_PATH);
      const certPath = path.resolve(__dirname, "..", process.env.SSL_CERT_PATH);

      const httpsOptions = {
        key: fs.readFileSync(keyPath, "utf8"),
        cert: fs.readFileSync(certPath, "utf8"),
        minVersion: "TLSv1.2",
        ciphers: [
          "ECDHE-RSA-AES128-GCM-SHA256",
          "ECDHE-RSA-AES256-GCM-SHA384",
          "ECDHE-RSA-AES128-SHA256",
          "ECDHE-RSA-AES256-SHA384",
        ].join(":"),
        honorCipherOrder: true,
      };

      if (process.env.SSL_CA_PATH) {
        const caPath = path.resolve(__dirname, "..", process.env.SSL_CA_PATH);
        httpsOptions.ca = fs.readFileSync(caPath, "utf8");
      }

      https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`
╔══════════════════════════════════════════════╗
║   🔒 PLAYMARKET API - SERVEUR HTTPS         ║
╠══════════════════════════════════════════════╣
║  Port: ${PORT}                                  ║
║  URL: https://localhost:${PORT}                 ║
║  Protocol: TLS/SSL                            ║
║  HSTS: ✅ Activé                              ║
║  Status: ✅ SECURE & READY                    ║
╚══════════════════════════════════════════════╝
        `);
      });
    } catch (error) {
      console.error("❌ Erreur configuration HTTPS:", error.message);
      console.log("⚠️  Démarrage en HTTP (fallback)");
      startHttpServer();
    }
  } else {
    startHttpServer();
  }
};

const startHttpServer = () => {
  app.listen(PORT, () => {
    const protocol = isProduction ? "⚠️  HTTP (non sécurisé)" : "HTTP (dev)";
    const hstsStatus = isProduction ? "❌ Désactivé (HTTP)" : "❌ Désactivé (dev)";
    
    console.log(`
╔══════════════════════════════════════════════╗
║   🚀 PLAYMARKET API - SERVEUR ${protocol.padEnd(20)}║
╠══════════════════════════════════════════════╣
║  Port: ${PORT}                                  ║
║  URL: http://localhost:${PORT}                 ║
║  Protocol: HTTP                               ║
║  HSTS: ${hstsStatus}                            ║
║  Status: ✅ READY                              ║
╚══════════════════════════════════════════════╝
    `);
  });
};

startServer();

module.exports = app;
