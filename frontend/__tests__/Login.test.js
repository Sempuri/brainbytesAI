import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "../pages/login";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    pathname: "/login",
    push: jest.fn(),
  }),
}));

describe("Login Page", () => {
  test("renders the sign-in form", () => {
    render(<Login />);
    expect(
      screen.getByRole("heading", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/you@example\.com/i),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/•+/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });
});
