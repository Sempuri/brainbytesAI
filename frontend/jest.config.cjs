const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  // Use custom environment to polyfill Request/Response/Headers before Next.js loads
  testEnvironment: "<rootDir>/jest.env.js",
  setupFiles: ["<rootDir>/jest.polyfill.js"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/cypress/"],
  moduleNameMapper: {
    // Mock ESM modules and Next.js router for Jest
    "^react-markdown$": "<rootDir>/__mocks__/react-markdown.js",
    "^next/router$": "<rootDir>/__mocks__/next/router.js",
  },
};

module.exports = createJestConfig(customJestConfig);
