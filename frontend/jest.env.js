const NodeEnvironment = require("jest-environment-jsdom");

class CustomEnv extends NodeEnvironment {
  async setup() {
    await super.setup();
    if (typeof this.global.Request === "undefined") {
      const fetch = require("node-fetch");
      this.global.Request = fetch.Request;
      this.global.Response = fetch.Response;
      this.global.Headers = fetch.Headers;
    }
  }
}

module.exports = CustomEnv;
