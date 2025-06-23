// Mock api.get for initial messages (always returns {data: []})
jest.mock("../utils/api", () => {
  const get = jest.fn((url) => {
    if (url && url.includes("/api/messages")) {
      // Return {data: []} to match Home's usage
      return Promise.resolve({ data: [] });
    }
    return Promise.resolve({ data: [] });
  });
  // post will be set per test
  const post = jest.fn();
  return {
    __esModule: true,
    default: {
      post,
      get,
    },
    setAuthToken: jest.fn(),
  };
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../pages/index";
import api from "../utils/api";

// Mock localStorage and scrollIntoView (if not already globally mocked)
beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(() => "mock-token"),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
  });
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe("Home Chat Loading and Error States", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading indicator while waiting for response", async () => {
    // Delay the post response, return {data: {userMessage, aiMessage, ...}}
    api.post.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: {
                  userMessage: {
                    _id: "1",
                    text: "Loading test",
                    isUser: true,
                    createdAt: new Date().toISOString(),
                  },
                  aiMessage: {
                    _id: "2",
                    text: "AI loading response",
                    isUser: false,
                    createdAt: new Date().toISOString(),
                  },
                  category: "",
                  questionType: "",
                  sentiment: "",
                },
              }),
            100,
          ),
        ),
    );

    render(<Home />);
    const input = screen.getByPlaceholderText(/ask a question/i);
    fireEvent.change(input, { target: { value: "Loading test" } });
    const button = screen.getByRole("button", { name: /send/i });
    fireEvent.click(button);

    // Button should show "Sending..." and be disabled
    expect(screen.getByRole("button", { name: /sending/i })).toBeDisabled();

    // Wait for loading to finish (button returns to "Send")
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /send/i })).toBeEnabled(),
    );
  });

  test("shows error message when API call fails", async () => {
    // First call: reject (simulate error)
    api.post.mockImplementationOnce(() =>
      Promise.reject(new Error("Network error")),
    );
    // Second call: resolve with {data: []} to keep state consistent
    api.post.mockImplementationOnce(() => Promise.resolve({ data: [] }));

    render(<Home />);
    const input = screen.getByPlaceholderText(/ask a question/i);
    fireEvent.change(input, { target: { value: "Error test" } });
    const button = screen.getByRole("button", { name: /send/i });
    fireEvent.click(button);

    // Wait for error message to appear in chat
    await waitFor(() => {
      expect(
        screen.getByText(/sorry, i couldn't process your request/i),
      ).toBeInTheDocument();
    });

    // Ensure messages state is still an array (no filter error)
    expect(
      screen.queryByText(/loading conversation history/i),
    ).not.toBeInTheDocument();
  });
});
