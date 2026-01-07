const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PlayMarket API",
      version: "1.0.0",
      description: "API REST complète pour marketplace de jeux vidéo avec authentification JWT et gestion de rôles",
      contact: {
        name: "PlayMarket Team",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Entrez votre token JWT (reçu après login/register)",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            email: { type: "string", format: "email", example: "user@example.com" },
            name: { type: "string", example: "John Doe" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Game: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Elden Ring" },
            price: { type: "number", format: "decimal", example: 59.99 },
            stock: { type: "integer", example: 100 },
            image_url: { type: "string", example: "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/aGhopp3MHppi7kooGE2Dtt8C.png" },
            rating: { type: "number", format: "decimal", example: 4.7, minimum: 0, maximum: 5 },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            user_id: { type: "integer", example: 1 },
            total: { type: "number", format: "decimal", example: 119.98 },
            created_at: { type: "string", format: "date-time" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
          },
        },
        OrderItem: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            order_id: { type: "integer", example: 1 },
            game_id: { type: "integer", example: 1 },
            quantity: { type: "integer", example: 2 },
            unit_price: { type: "number", format: "decimal", example: 59.99 },
          },
        },
        GameDetails: {
          type: "object",
          properties: {
            gameId: { type: "integer", example: 1 },
            description: { type: "string", example: "Un RPG d'action épique" },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["action", "rpg", "open-world"],
            },
            videos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Trailer" },
                  url: { type: "string", example: "https://youtube.com/..." },
                },
              },
            },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ActivityLog: {
          type: "object",
          properties: {
            userId: { type: "integer", example: 1 },
            event: { type: "string", example: "VIEW_GAME" },
            gameId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Recommendation: {
          type: "object",
          properties: {
            userId: { type: "integer", example: 1 },
            generatedAt: { type: "string", format: "date-time" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  gameId: { type: "integer", example: 1 },
                  score: { type: "number", example: 0.88 },
                  reason: { type: "string", example: "Vous aimez les jeux d'action" },
                },
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Message d'erreur" },
            details: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentification et autorisation" },
      { name: "Users", description: "Gestion des utilisateurs (Admin)" },
      { name: "Games", description: "Catalogue de jeux" },
      { name: "Orders", description: "Gestion des commandes" },
      { name: "MongoDB", description: "Données non structurées (Logs, Détails, Recommandations)" },
    ],
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);

