/* eslint-env jest */
// __mocks__/@google/genai.js
// Jest mock for Gemini API to silence errors and allow tests to pass in CI

// ESM-compatible Jest mock for Gemini API
export class GoogleGenAI {
  constructor() {}
  // Mock the models property as an object with generateContent
  models = {
    generateContent: jest.fn().mockResolvedValue({
      candidates: [
        { content: { parts: [{ text: "Mocked Gemini response" }] } },
      ],
    }),
  };
}

// Provide a default export for CommonJS compatibility
export default { GoogleGenAI };
