const request = require("supertest");
const app = require("../server");

describe("Protected Routes", () => {
  let token;
  let userId;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: `protected${Date.now()}@example.com`,
      password: "Test1234",
      name: "Protected User",
      role: "user",
    });
    token = res.body.accessToken;
    userId = res.body.user.id;
  });

  describe("GET /api/auth/me - Protected", () => {
    it("should get user info with valid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty("email");
    });

    it("should reject without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.statusCode).toBe(401);
    });

    it("should reject with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid_token");

      expect(res.statusCode).toBe(403);
    });
  });

  describe("POST /api/orders - Protected", () => {
    it("should create order with valid token", async () => {
      const res = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({
          user_id: userId,
          items: [
            {
              game_id: 1,
              quantity: 1,
              unit_price: 59.99,
            },
          ],
        });

      expect([201, 400]).toContain(res.statusCode);
    });

    it("should reject order creation without token", async () => {
      const res = await request(app).post("/api/orders").send({
        user_id: userId,
        items: [],
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/orders/user/:userId - Protected", () => {
    it("should get user orders with valid token", async () => {
      const res = await request(app)
        .get(`/api/orders/user/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should reject without token", async () => {
      const res = await request(app).get(`/api/orders/user/${userId}`);

      expect(res.statusCode).toBe(401);
    });
  });
});

