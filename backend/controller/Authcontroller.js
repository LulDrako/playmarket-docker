const AuthService = require("../services/Auth.service");

// Configuration des cookies sécurisés
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true, // Protection XSS - inaccessible via JavaScript
    secure: isProduction, // Uniquement en HTTPS en production
    sameSite: "strict", // Protection CSRF
    path: "/", // Disponible sur tout le site
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours (en millisecondes)
  };
};

class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password, name, role } = req.body;
      const result = await AuthService.register({ email, password, name, role });
      
      // Envoyer le refresh token dans un cookie sécurisé
      res.cookie("refreshToken", result.refreshToken, getCookieOptions());
      
      res.status(201).json({
        message: "Inscription réussie",
        user: result.user,
        accessToken: result.accessToken,
        // Ne plus renvoyer refreshToken dans le body (sécurité)
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      
      // Envoyer le refresh token dans un cookie sécurisé
      res.cookie("refreshToken", result.refreshToken, getCookieOptions());
      
      res.status(200).json({
        message: "Connexion réussie",
        user: result.user,
        accessToken: result.accessToken,
        // Ne plus renvoyer refreshToken dans le body (sécurité)
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      // Lire le refresh token depuis le cookie (au lieu du body)
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token requis (cookie manquant)" });
      }
      
      if (typeof refreshToken !== 'string' || refreshToken.trim() === '') {
        return res.status(400).json({ error: "Format de refresh token invalide" });
      }
      
      const result = await AuthService.refreshAccessToken(refreshToken);
      
      // ROTATION : Renouveler le cookie refresh token (protection session fixation)
      // L'ancien refresh token est remplacé par un nouveau, invalidant l'ancien
      res.cookie("refreshToken", result.refreshToken, getCookieOptions());
      
      res.status(200).json({
        message: "Token rafraîchi avec succès",
        accessToken: result.accessToken,
        // Le nouveau refreshToken est dans le cookie, pas dans le body (sécurité)
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      res.status(200).json({
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      // Supprimer le cookie refreshToken
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      
      res.status(200).json({
        message: "Déconnexion réussie",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;

