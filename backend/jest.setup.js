import { Headers } from "node-fetch";
if (typeof global.Headers === "undefined") {
  global.Headers = Headers;
}
