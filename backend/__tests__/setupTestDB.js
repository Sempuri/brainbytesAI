// Jest global mock for mongoose
import mongoose from "mongoose";
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

// Remove mongodb-memory-server and mongoose connection logic, as we now mock mongoose
