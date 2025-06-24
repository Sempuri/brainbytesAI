/* eslint-env jest */
// __mocks__/@google/genai.js
// Jest mock for Gemini API to silence errors and allow tests to pass in CI

// ESM-compatible Jest mock for Gemini API
export class GoogleGenAI {
  constructor() {
    this.models = {
      generateContent: async () => ({
        candidates: [
          { content: { parts: [{ text: "Mocked Gemini response" }] } },
        ],
      }),
    };
  }
}

// Provide a default export for CommonJS compatibility
export default { GoogleGenAI };
