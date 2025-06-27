export default {
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "./reports", outputName: "junit.xml" }],
  ],
  collectCoverage: true,
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/"],
   transform: {}, // disable babel, rely on native ESM
    testEnvironment: "node",
    moduleFileExtensions: ["js", "json", "node"],
  //moduleNameMapper: {
  // "^(\\.{1,2}/.*)\\.js$": "$1",
 // },
  // Make sure ES modules are properly handled
  transformIgnorePatterns: ["/node_modules/(?!(.+\\.mjs$))"],
};
