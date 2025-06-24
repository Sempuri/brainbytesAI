try {
  if (typeof global.Request === "undefined") {
    global.Request = require("node-fetch").Request;
  }
  if (typeof global.Response === "undefined") {
    global.Response = require("node-fetch").Response;
  }
  if (typeof global.Headers === "undefined") {
    global.Headers = require("node-fetch").Headers;
  }
} catch (e) {
  // node-fetch may not be available in all environments
}
