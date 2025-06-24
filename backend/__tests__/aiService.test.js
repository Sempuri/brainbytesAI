import { jest } from "@jest/globals";
// Set dummy MongoDB URI for tests before importing server.js
process.env.MONGODB_URI = "mock";

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

import { generateResponse } from "../aiService.js";

// Mock the GoogleGenAI class
jest.mock("@google/genai", () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: "This is a mock response from the AI model.",
          }),
        },
      };
    }),
  };
});

jest.mock("@google/genai");

describe("Category detection", () => {
  test("detects math category correctly", () => {
    const questionText = "What is 2+2?";
    return generateResponse(questionText).then((result) => {
      expect(result.category).toBe("math");
    });
  });

  test("detects science category correctly", () => {
    const questionText = "What is a neutron?";
    return generateResponse(questionText).then((result) => {
      expect(result.category).toBe("science");
    });
  });

  test("detects history category correctly", () => {
    const questionText = "Who was the first president of the Philippines?";
    return generateResponse(questionText).then((result) => {
      expect(result.category).toBe("history");
    });
  });

  test("uses general category for unknown topics", async () => {
    const questionText = "What is the meaning of life?";
    const result = await generateResponse(questionText);
    expect(result.category).toBe("general");
  }, 30000);
});

describe("Question type detection", () => {
  test("detects definition questions", () => {
    const questionText = "What is photosynthesis?";
    return generateResponse(questionText).then((result) => {
      expect(result.questionType).toBe("definition");
    });
  });

  test("detects explanation questions", () => {
    const questionText = "Why does the sun rise in the east?";
    return generateResponse(questionText).then((result) => {
      expect(result.questionType).toBe("explanation");
    });
  });

  test("detects calculation questions", () => {
    const questionText = "Calculate the area of a circle with radius 5cm";
    return generateResponse(questionText).then((result) => {
      expect(result.questionType).toBe("calculation");
    });
  });
});

describe("Sentiment analysis", () => {
  test("detects positive sentiment", () => {
    const questionText = "Thank you for this helpful information";
    return generateResponse(questionText).then((result) => {
      expect(result.sentiment).toBe("positive");
    });
  });

  test("detects negative sentiment", () => {
    const questionText = "I am so disappointed with this answer";
    return generateResponse(questionText).then((result) => {
      expect(result.sentiment).toBe("negative");
    });
  });

  test("defaults to neutral sentiment", () => {
    const questionText = "What is the capital of France?";
    return generateResponse(questionText).then((result) => {
      expect(result.sentiment).toBe("neutral");
    });
  });
});
