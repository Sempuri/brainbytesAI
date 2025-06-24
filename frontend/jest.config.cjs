const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  // Patch globals before any Next.js code loads
  setupFiles: ["<rootDir>/jest.global.js", "<rootDir>/jest.polyfill.js"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/cypress/"],
  moduleNameMapper: {
    // Mock ESM modules and Next.js router for Jest
    "^react-markdown$": "<rootDir>/__mocks__/react-markdown.js",
    "^next/router$": "<rootDir>/__mocks__/next/router.js",
  },
};

module.exports = createJestConfig(customJestConfig);
