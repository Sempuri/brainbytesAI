import request from "supertest";
import app from "../server.js";

describe("Authentication Routes", () => {
  let testEmail = `testuser${Date.now()}@example.com`;
  let token;

  test("Register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: testEmail,
        password: "password123",
        preferredSubjects: ["Math", "Science"],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(testEmail);

    token = res.body.token; // Save token for next test
  });

  test("Login with the same user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: "password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(testEmail);
  });

    test("Get current user's profile with token", async () => {
    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", testEmail);
    expect(res.body).toHaveProperty("name", "Test User");
  });
});
