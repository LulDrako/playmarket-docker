const errorHandler = (err, req, res, next) => {
  console.error("❌ Erreur serveur:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  const statusCode = err.status || err.statusCode || 500;

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Erreur de validation",
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      error: "Format de données invalide",
      field: err.path,
    });
  }

  if (err.code) {
    switch (err.code) {
      case "23505":
        return res.status(409).json({
          error: "Cette valeur existe déjà",
          detail: err.detail,
        });
      case "23503":
        return res.status(400).json({
          error: "Référence invalide",
          detail: err.detail,
        });
      case "22P02":
        return res.status(400).json({
          error: "Format de données invalide",
        });
    }
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Token invalide",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token expiré",
    });
  }

  res.status(statusCode).json({
    error: err.message || "Erreur interne du serveur",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Route non trouvée",
    path: req.path,
    method: req.method,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};

