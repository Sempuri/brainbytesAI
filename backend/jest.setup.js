import { Headers } from "node-fetch";
if (typeof global.Headers === "undefined") {
  global.Headers = Headers;
}
// Removed global Jest Mongoose mock; now mocked in each test file.
