const { body, param, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Erreur de validation",
      details: errors.array(),
    });
  }
  next();
};

const validateRegister = [
  body("email").isEmail().withMessage("Email invalide").normalizeEmail().escape(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"),
  // Sanitization XSS : escape() échappe les caractères HTML dangereux
  body("name")
    .notEmpty().withMessage("Le nom est requis")
    .isLength({ min: 2, max: 100 }).withMessage("Le nom doit contenir entre 2 et 100 caractères")
    .trim()
    .escape(), // Protection XSS : échappe <, >, &, ", '
  body("role").optional().isIn(["user", "admin"]).withMessage("Le rôle doit être 'user' ou 'admin'").escape(),
  handleValidationErrors,
];

const validateLogin = [
  body("email").isEmail().withMessage("Email invalide").normalizeEmail().escape(),
  body("password").notEmpty().withMessage("Mot de passe requis"),
  handleValidationErrors,
];

const validateGame = [
  // Sanitization XSS : escape() pour protéger contre les injections XSS
  body("title")
    .notEmpty().withMessage("Le titre est requis")
    .isLength({ max: 255 }).withMessage("Le titre ne doit pas dépasser 255 caractères")
    .trim()
    .escape(), // Protection XSS
  body("price").isNumeric().withMessage("Le prix doit être un nombre").isFloat({ min: 0 }).withMessage("Le prix doit être positif"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Le stock doit être un nombre entier positif"),
  body("image_url").optional().isURL().withMessage("L'URL de l'image doit être valide"),
  body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("Le rating doit être entre 0 et 5"),
  handleValidationErrors,
];

const validateStock = [
  body("stock").isInt({ min: 0 }).withMessage("Le stock doit être un nombre entier positif"),
  handleValidationErrors,
];

const validateId = [
  // Protection injection : validation stricte de l'ID (entier uniquement)
  param("id").isInt({ min: 1 }).withMessage("ID invalide").toInt(),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateGame,
  validateStock,
  validateId,
  handleValidationErrors,
};

