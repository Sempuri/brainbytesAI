import React from "react";
import { render, screen } from "@testing-library/react";
import Chat from "../components/Chat";
import api from "../utils/api"; // ✅ default import

jest.mock("../utils/api"); // ✅ mock default export

describe("Chat Component", () => {
  test("displays loading indicator", () => {
    api.get = jest.fn(() => new Promise(() => {})); // ✅ override .get manually
    render(<Chat />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("displays error message on API failure", async () => {
    api.get = jest.fn().mockRejectedValue(new Error("API failed")); // ✅ override .get again
    render(<Chat />);
    const errorMessage = await screen.findByText(/error/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
