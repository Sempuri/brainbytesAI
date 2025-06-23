import request from "supertest";
import app from "../server.js"; // Use .js extension with ES modules

describe("API Health Check", () => {
  test("GET / returns welcome message", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Welcome to the BrainBytes API",
    );
  });

  test("GET /api/protected without token returns 401", async () => {
    const response = await request(app).get("/api/protected");
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("error", "Unauthorized");
  });
});

describe("Chat API", () => {
  let token;

  beforeAll(async () => {
    // Register a test user
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "chatapitest@example.com",
        password: "testpassword",
        preferredSubjects: ["math"],
      });

    // Login to get JWT token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "chatapitest@example.com",
      password: "testpassword",
    });
    console.log("Login response:", loginRes.body); // Debug: log the login response
    token = loginRes.body.token;
    if (!token) {
      throw new Error(
        "No token returned from login. Response: " +
          JSON.stringify(loginRes.body),
      );
    }
  }, 30000); // 30s timeout for slow DB/network

  test("POST /api/messages returns correct response", async () => {
    const response = await request(app)
      .post("/api/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "Hello AI" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("userMessage");
    expect(response.body).toHaveProperty("aiMessage");
    expect(response.body.userMessage.text).toBe("Hello AI");
    expect(response.body.aiMessage).toBeDefined();
  }, 30000);

  test("GET /api/messages returns messages array", async () => {
    const response = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  }, 30000);

  test("POST /api/messages with invalid data returns 400", async () => {
    const response = await request(app)
      .post("/api/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({}); // Missing 'text'

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  }, 30000);
});
