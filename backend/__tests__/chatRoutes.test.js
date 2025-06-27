import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";


describe("POST /api/chat", () => {
  test("should save message and return 201", async () => {
    const payload = {
      session: "abc123",
      message: "Hello, AI!",
    };

    const response = await request(app)
      .post("/api/chat")
      .send(payload)
      .expect(201); // status code should be 201

    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("savedMessage");
    expect(response.body.savedMessage.message).toBe("Hello, AI!");
  });

  test("should return 400 if message is missing", async () => {
  const payload = {
    session: "abc123",
    // message is missing
  };

  const response = await request(app)
    .post("/api/chat")
    .send(payload)
    .expect(400);

  expect(response.body).toHaveProperty("status", "error");
  expect(response.body.message).toMatch(/missing/i);
});

afterAll(async () => {
  await mongoose.disconnect();
});

});