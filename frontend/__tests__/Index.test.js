import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../pages/index";
import axios from "axios";

// Mock react-markdown
jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="markdown">{children}</div>,
}));

// Mock hooks and API calls
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    pathname: "/",
    query: {},
    replace: jest.fn(), // Add this mock function
    push: jest.fn(), // Add this mock function
    asPath: "", // Add other router properties that might be used
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

jest.mock("axios");
axios.get.mockImplementation((url) => {
  if (url.includes("/api/messages")) {
    return Promise.resolve({
      data: {
        messages: [],
        subjects: ["Math", "Science", "History"],
      },
    });
  }
  return Promise.resolve({ data: {} });
});

jest.mock("../utils/api", () => ({
  get: jest.fn(() => Promise.resolve({ data: { user: "Test User" } })),
}));

// Mock localStorage to prevent test errors
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn((key) => (key === "token" ? "mock-token" : null)),
    setItem: jest.fn(() => null),
    removeItem: jest.fn(),
  },
  writable: true,
});

test("renders BrainBytes AI title", () => {
  render(<Home />);
  expect(screen.getByText(/BrainBytes AI/i)).toBeInTheDocument();
});

test("shows subject filter options", () => {
  render(<Home />);
  expect(screen.getByText(/Filter by subject/i)).toBeInTheDocument();
});

test("shows message input area", () => {
  render(<Home />);
  const inputArea = screen.getByPlaceholderText(/Ask a question/i);
  expect(inputArea).toBeInTheDocument();
  expect(inputArea.tagName).toBe("INPUT");
});

test("send button is initially enabled", () => {
  render(<Home />);
  const sendButton = screen.getByRole("button", { name: /Send/i });
  expect(sendButton).toBeEnabled();
});
