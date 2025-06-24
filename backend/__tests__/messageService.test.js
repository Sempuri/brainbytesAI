process.env.MONGODB_URI = "mock";
import { jest } from "@jest/globals";

beforeAll(() => {
  process.env.MONGODB_URI = "mock";
});

// Mock mongoose to avoid real DB connection in tests
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

import * as messageService from "../services/messageService.js";
import { Message } from "../server.js";

describe("Message Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("saveMessage calls Message.create with correct data", async () => {
    const createSpy = jest
      .spyOn(Message, "create")
      .mockResolvedValueOnce({ _id: "123", text: "Test message" });

    const message = { text: "Test message", isUser: true, userId: "user1" };
    await messageService.saveMessage(message);

    expect(createSpy).toHaveBeenCalledWith(message);
    expect(createSpy).toHaveBeenCalledTimes(1);
  });

  test("getMessagesByUser returns messages from Message.find", async () => {
    const mockMessages = [
      { text: "Hello", isUser: true },
      { text: "Hi there", isUser: false },
    ];
    // Mock the chainable sort method
    const sortMock = jest.fn().mockResolvedValueOnce(mockMessages);
    const findSpy = jest
      .spyOn(Message, "find")
      .mockReturnValue({ sort: sortMock });

    const result = await messageService.getMessagesByUser("user1");

    expect(findSpy).toHaveBeenCalledWith({ userId: "user1" });
    expect(sortMock).toHaveBeenCalledWith({ createdAt: 1 });
    expect(result).toEqual(mockMessages);
  });
});
