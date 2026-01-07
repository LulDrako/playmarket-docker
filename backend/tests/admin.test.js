const request = require("supertest");
const app = require("../server");

describe("Admin Routes", () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    const adminRes = await request(app).post("/api/auth/register").send({
      email: `admin${Date.now()}@example.com`,
      password: "Admin1234",
      name: "Admin User",
      role: "admin",
    });
    adminToken = adminRes.body.accessToken;

    const userRes = await request(app).post("/api/auth/register").send({
      email: `user${Date.now()}@example.com`,
      password: "User1234",
      name: "Normal User",
      role: "user",
    });
    userToken = userRes.body.accessToken;
  });

  describe("GET /api/users - Admin Only", () => {
    it("should get all users with admin token", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should reject without token", async () => {
      const res = await request(app).get("/api/users");

      expect(res.statusCode).toBe(401);
    });

    it("should reject with user token", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe("GET /api/orders - Admin Only", () => {
    it("should get all orders with admin token", async () => {
      const res = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should reject with user token", async () => {
      const res = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe("GET /api/mongo/activity - Admin Only", () => {
    it("should get all activities with admin token", async () => {
      const res = await request(app)
        .get("/api/mongo/activity")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should reject with user token", async () => {
      const res = await request(app)
        .get("/api/mongo/activity")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});

