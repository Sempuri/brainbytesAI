/* eslint-env jest */
/* eslint-env jest */
// __mocks__/@google/genai.js
// Jest mock for Gemini API to silence errors and allow tests to pass in CI

// ESM-compatible Jest mock for Gemini API
export class GoogleGenAI {
  constructor() {}
  // Mock the models() method to return an object with generateContent
  models() {
    return {
      generateContent: jest.fn().mockResolvedValue({
        candidates: [
          { content: { parts: [{ text: "Mocked Gemini response" }] } },
        ],
      }),
    };
  }
}
