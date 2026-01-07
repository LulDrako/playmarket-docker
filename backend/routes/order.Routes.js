const express = require("express");
const router = express.Router();
const OrdersController = require("../controller/Ordercontroller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/roles.middleware");
const { validateId } = require("../middlewares/validation.middleware");

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Récupérer toutes les commandes (Admin uniquement)
 *     description: Retourne la liste complète de toutes les commandes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
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
router.get("/", authenticateToken, requireAdmin, OrdersController.getAll);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Récupérer une commande par ID
 *     description: Retourne les détails d'une commande spécifique
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant unique de la commande
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la commande
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Commande non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", authenticateToken, validateId, OrdersController.getById);

/**
 * @swagger
 * /api/orders/user/{userId}:
 *   get:
 *     tags: [Orders]
 *     summary: Récupérer les commandes d'un utilisateur
 *     description: Retourne toutes les commandes d'un utilisateur spécifique
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Identifiant unique de l'utilisateur
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des commandes de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/user/:userId", authenticateToken, OrdersController.getByUserId);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Créer une nouvelle commande
 *     description: Crée une nouvelle commande avec les articles spécifiés
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Détails de la commande à créer
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, items]
 *             properties:
 *               user_id: { type: integer, example: 1 }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     game_id: { type: integer, example: 1 }
 *                     quantity: { type: integer, example: 2 }
 *                     unit_price: { type: number, example: 59.99 }
 *     responses:
 *       201:
 *         description: Commande créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Commande créée avec succès" }
 *                 order: { $ref: '#/components/schemas/Order' }
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
 */
router.post("/", authenticateToken, OrdersController.create);

module.exports = router;
