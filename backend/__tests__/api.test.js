// ESM-compatible mock for mongoose before any imports
process.env.MONGODB_URI = "mock";
import { jest } from "@jest/globals";

// In-memory stores for users and messages
const users = [];
const messages = [];
let userIdCounter = 1;
let messageIdCounter = 1;

function makeUser(data) {
  return {
    _id: data._id || `user_${userIdCounter++}`,
    name: data.name,
    email: data.email,
    password: data.password,
    preferredSubjects: data.preferredSubjects || [],
    ...data,
  };
}
function makeMessage(data) {
  return {
    _id: data._id || `msg_${messageIdCounter++}`,
    ...data,
  };
}

await jest.unstable_mockModule("mongoose", () => {
  // Helper to mock chainable query methods
  const chainable = (result) => ({
    sort: jest.fn().mockResolvedValue(result || []),
    select: jest.fn().mockResolvedValue(result || {}),
    exec: jest.fn().mockResolvedValue(result || {}),
  });

  // UserProfile mock
  const UserProfile = function (data) {
    Object.assign(this, makeUser(data));
    this.save = jest.fn().mockImplementation(async () => {
      if (!users.find((u) => u.email === this.email)) {
        users.push({ ...this });
      }
      return this;
    });
  };
  UserProfile.create = jest.fn().mockImplementation(async (data) => {
    if (!users.find((u) => u.email === data.email)) {
      const user = makeUser(data);
      users.push(user);
      return user;
    }
    throw new Error("User already exists");
  });
  UserProfile.findOne = jest.fn().mockImplementation(async (query) => {
    return (
      users.find(
        (u) =>
          (!query.email || u.email === query.email) &&
          (!query.password || u.password === query.password),
      ) || null
    );
  });
  UserProfile.findById = jest.fn().mockResolvedValue(null);
  UserProfile.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
  UserProfile.findByIdAndDelete = jest.fn().mockResolvedValue(null);
  UserProfile.find = jest.fn().mockReturnValue(chainable(users));

  // Message mock
  const Message = function (data) {
    Object.assign(this, makeMessage(data));
    this.save = jest.fn().mockImplementation(async () => {
      messages.push({ ...this });
      return this;
    });
  };
  Message.create = jest.fn().mockImplementation(async (data) => {
    const msg = makeMessage(data);
    messages.push(msg);
    return msg;
  });
  Message.find = jest.fn().mockReturnValue(chainable(messages));
  Message.findOne = jest.fn().mockImplementation(async (query) => {
    return (
      messages.find((m) => {
        return Object.entries(query).every(([k, v]) => m[k] === v);
      }) || null
    );
  });
  Message.findById = jest.fn().mockResolvedValue(null);
  Message.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
  Message.findByIdAndDelete = jest.fn().mockResolvedValue(null);

  class MockSchema {}
  MockSchema.Types = { ObjectId: class ObjectId {} };
  const mockMongoose = {
    connect: jest.fn().mockResolvedValue({}),
    disconnect: jest.fn().mockResolvedValue({}),
    model: jest.fn((name) => {
      const lower = name.toLowerCase();
      if (lower.includes("user")) return UserProfile;
      if (lower.includes("message")) return Message;
      return function () {};
    }),
    Schema: MockSchema,
  };
  return {
    ...mockMongoose,
    default: mockMongoose,
  };
});

jest.resetModules();
import request from "supertest";
const { default: app } = await import("../server.js");

// Directly mock UserProfile and Message models on the imported server module
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
