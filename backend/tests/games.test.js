const request = require("supertest");
const app = require("../server");

describe("Games Routes", () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    const adminRes = await request(app).post("/api/auth/register").send({
      email: `admin${Date.now()}@example.com`,
      password: "Admin1234",
      name: "Game Admin",
      role: "admin",
    });
    adminToken = adminRes.body.accessToken;

    const userRes = await request(app).post("/api/auth/register").send({
      email: `user${Date.now()}@example.com`,
      password: "User1234",
      name: "Game User",
      role: "user",
    });
    userToken = userRes.body.accessToken;
  });

  describe("GET /api/games - Public", () => {
    it("should get all games without authentication", async () => {
      const res = await request(app).get("/api/games");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/games/:id - Public", () => {
    it("should get a game by id", async () => {
      const res = await request(app).get("/api/games/1");

      expect([200, 404]).toContain(res.statusCode);
    });

    it("should return 400 for invalid id", async () => {
      const res = await request(app).get("/api/games/invalid");

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/games - Admin Only", () => {
    it("should create game with admin token", async () => {
      const res = await request(app)
        .post("/api/games")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Test Game",
          price: 59.99,
          stock: 100,
        });

      expect([201, 409]).toContain(res.statusCode);
    });

    it("should reject game creation without token", async () => {
      const res = await request(app).post("/api/games").send({
        title: "Test Game",
        price: 59.99,
        stock: 100,
      });

      expect(res.statusCode).toBe(401);
    });

    it("should reject game creation with user token", async () => {
      const res = await request(app)
        .post("/api/games")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          title: "Test Game",
          price: 59.99,
          stock: 100,
        });

      expect(res.statusCode).toBe(403);
    });

    it("should reject game creation with invalid data", async () => {
      const res = await request(app)
        .post("/api/games")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "",
          price: -10,
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("PATCH /api/games/:id/stock - Admin Only", () => {
    it("should update stock with admin token", async () => {
      const res = await request(app)
        .patch("/api/games/1/stock")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ stock: 50 });

      expect([200, 404]).toContain(res.statusCode);
    });

    it("should reject stock update without token", async () => {
      const res = await request(app)
        .patch("/api/games/1/stock")
        .send({ stock: 50 });

      expect(res.statusCode).toBe(401);
    });
  });
});

