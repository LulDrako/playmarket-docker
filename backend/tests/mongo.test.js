const request = require("supertest");
const app = require("../server");

describe("MongoDB Routes", () => {
  let adminToken;
  let userToken;
  let userId;

  beforeAll(async () => {
    const adminRes = await request(app).post("/api/auth/register").send({
      email: `mongoadmin${Date.now()}@example.com`,
      password: "Admin1234",
      name: "Mongo Admin",
      role: "admin",
    });
    adminToken = adminRes.body.accessToken;

    const userRes = await request(app).post("/api/auth/register").send({
      email: `mongouser${Date.now()}@example.com`,
      password: "User1234",
      name: "Mongo User",
      role: "user",
    });
    userToken = userRes.body.accessToken;
    userId = userRes.body.user.id;
  });

  describe("GameDetails Routes", () => {
    let testGameId;

    beforeAll(() => {
      testGameId = Math.floor(Math.random() * 1000000) + 1000;
    });

    describe("GET /api/mongo/gamedetails - Public", () => {
      it("should get all game details without auth", async () => {
        const res = await request(app).get("/api/mongo/gamedetails");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      });
    });

    describe("GET /api/mongo/gamedetails/:gameId - Public", () => {
      it("should get game details by id", async () => {
        const res = await request(app).get("/api/mongo/gamedetails/1");

        expect([200, 404]).toContain(res.statusCode);
      });
    });

    describe("POST /api/mongo/gamedetails - Admin Only", () => {
      it("should create game details with admin token", async () => {
        const res = await request(app)
          .post("/api/mongo/gamedetails")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            gameId: testGameId,
            description: "Test game description",
            tags: ["action", "test"],
          });

        expect(res.statusCode).toBe(201);
      });

      it("should reject without auth", async () => {
        const res = await request(app).post("/api/mongo/gamedetails").send({
          gameId: testGameId + 1,
          description: "Test",
        });

        expect(res.statusCode).toBe(401);
      });

      it("should reject with user token", async () => {
        const res = await request(app)
          .post("/api/mongo/gamedetails")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            gameId: testGameId + 2,
            description: "Test",
          });

        expect(res.statusCode).toBe(403);
      });
    });

    describe("PUT /api/mongo/gamedetails/:gameId - Admin Only", () => {
      it("should update game details with admin token", async () => {
        const res = await request(app)
          .put("/api/mongo/gamedetails/1")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            description: "Updated description",
          });

        expect([200, 404]).toContain(res.statusCode);
      });

      it("should reject with user token", async () => {
        const res = await request(app)
          .put("/api/mongo/gamedetails/1")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            description: "Updated",
          });

        expect(res.statusCode).toBe(403);
      });
    });
  });

  describe("Activity Logs Routes", () => {
    describe("POST /api/mongo/activity - Protected", () => {
      it("should log activity with user token", async () => {
        const res = await request(app)
          .post("/api/mongo/activity")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            userId: userId,
            event: "VIEW_GAME",
            gameId: 1,
          });

        expect(res.statusCode).toBe(201);
      });

      it("should reject without auth", async () => {
        const res = await request(app).post("/api/mongo/activity").send({
          userId: 1,
          event: "VIEW_GAME",
        });

        expect(res.statusCode).toBe(401);
      });
    });

    describe("GET /api/mongo/activity/:userId - Protected", () => {
      it("should get user activity with auth", async () => {
        const res = await request(app)
          .get(`/api/mongo/activity/${userId}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      });

      it("should reject without auth", async () => {
        const res = await request(app).get(`/api/mongo/activity/${userId}`);

        expect(res.statusCode).toBe(401);
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

  describe("Recommendations Routes", () => {
    describe("GET /api/mongo/recommendations/:userId - Protected", () => {
      it("should get user recommendations with auth", async () => {
        const res = await request(app)
          .get(`/api/mongo/recommendations/${userId}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect([200, 404]).toContain(res.statusCode);
      });

      it("should reject without auth", async () => {
        const res = await request(app).get(`/api/mongo/recommendations/${userId}`);

        expect(res.statusCode).toBe(401);
      });
    });

    describe("PUT /api/mongo/recommendations/:userId - Protected", () => {
      it("should update recommendations with auth", async () => {
        const res = await request(app)
          .put(`/api/mongo/recommendations/${userId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            items: [
              { gameId: 1, score: 0.9, reason: "Test" }
            ],
          });

        expect(res.statusCode).toBe(200);
      });

      it("should reject without auth", async () => {
        const res = await request(app)
          .put(`/api/mongo/recommendations/${userId}`)
          .send({ items: [] });

        expect(res.statusCode).toBe(401);
      });
    });

    describe("GET /api/mongo/recommendations - Admin Only", () => {
      it("should get all recommendations with admin token", async () => {
        const res = await request(app)
          .get("/api/mongo/recommendations")
          .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      });

      it("should reject with user token", async () => {
        const res = await request(app)
          .get("/api/mongo/recommendations")
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(403);
      });
    });
  });
});

