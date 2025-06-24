import { Headers } from "node-fetch";
if (typeof global.Headers === "undefined") {
  global.Headers = Headers;
}

// Global Jest mock for mongoose
jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose");
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue({}),
    disconnect: jest.fn().mockResolvedValue({}),
    model: jest.fn(() => ({
      create: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      // Add more methods as needed
    })),
  };
});
