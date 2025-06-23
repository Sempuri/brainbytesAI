// Polyfill global.Headers for Node 16.x compatibility with @google/genai
if (typeof global.Headers === "undefined") {
  global.Headers = require("node-fetch").Headers;
}
