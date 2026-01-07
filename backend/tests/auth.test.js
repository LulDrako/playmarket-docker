const request = require("supertest");
const app = require("../server");

describe("Auth Routes - Public", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user with valid data", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: `test${Date.now()}@example.com`,
        password: "Test1234",
        name: "Test User",
        role: "user",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refreshToken");
      expect(res.body.user).toHaveProperty("email");
    });

    it("should reject registration with invalid email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "invalid-email",
        password: "Test1234",
      });

      expect(res.statusCode).toBe(400);
    });

    it("should reject registration with weak password", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "123",
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeAll(async () => {
      await request(app).post("/api/auth/register").send({
        email: "logintest@example.com",
        password: "Test1234",
        name: "Login Test",
      });
    });

    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "logintest@example.com",
        password: "Test1234",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refreshToken");
    });

    it("should reject login with invalid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "logintest@example.com",
        password: "WrongPassword",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/auth/refresh", () => {
    it("should refresh token with valid refresh token", async () => {
      const registerRes = await request(app).post("/api/auth/register").send({
        email: `refresh${Date.now()}@example.com`,
        password: "Test1234",
        name: "Refresh Test",
      });

      const refreshToken = registerRes.body.refreshToken;

      const res = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
    });

    it("should reject refresh with invalid token", async () => {
      const res = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken: "invalid_token" });

      expect(res.statusCode).toBe(403);
    });
  });
});

