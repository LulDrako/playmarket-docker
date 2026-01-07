const express = require("express");
const router = express.Router();
const GamesController = require("../controller/Productscontroller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/roles.middleware");
const {
  validateGame,
  validateStock,
  validateId,
} = require("../middlewares/validation.middleware");

/**
 * @swagger
 * /api/games:
 *   get:
 *     tags: [Games]
 *     summary: Récupérer tous les jeux
 *     responses:
 *       200:
 *         description: Liste des jeux
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */
router.get("/", GamesController.getAll);

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     tags: [Games]
 *     summary: Récupérer un jeu par ID
 *     description: Retourne les détails d'un jeu spécifique
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant unique du jeu
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails du jeu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Jeu non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateId, GamesController.getById);

/**
 * @swagger
 * /api/games:
 *   post:
 *     tags: [Games]
 *     summary: Créer un nouveau jeu (Admin uniquement)
 *     description: Ajoute un nouveau jeu au catalogue
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Détails du nouveau jeu à créer
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, price]
 *             properties:
 *               title: { type: string, example: Elden Ring }
 *               price: { type: number, example: 59.99 }
 *               stock: { type: integer, example: 100, default: 0 }
 *               image_url: { type: string, example: https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/aGhopp3MHppi7kooGE2Dtt8C.png }
 *               rating: { type: number, example: 4.7, minimum: 0, maximum: 5, default: 4.0 }
 *     responses:
 *       201:
 *         description: Jeu créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Jeu créé avec succès" }
 *                 game: { $ref: '#/components/schemas/Game' }
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Permission refusée (admin requis)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", authenticateToken, requireAdmin, validateGame, GamesController.create);

/**
 * @swagger
 * /api/games/{id}/stock:
 *   patch:
 *     tags: [Games]
 *     summary: Mettre à jour le stock d'un jeu (Admin uniquement)
 *     description: Modifie la quantité en stock d'un jeu
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant unique du jeu
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       description: Nouvelle quantité en stock
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stock]
 *             properties:
 *               stock: { type: integer, example: 50 }
 *     responses:
 *       200:
 *         description: Stock mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Stock mis à jour" }
 *                 game: { $ref: '#/components/schemas/Game' }
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Permission refusée (admin requis)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Jeu non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/:id/stock", authenticateToken, requireAdmin, validateId, validateStock, GamesController.updateStock);

module.exports = router;
