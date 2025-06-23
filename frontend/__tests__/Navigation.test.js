import React from "react";
import { render, screen } from "@testing-library/react";
import Navigation from "../components/Navigation";
import { useRouter } from "next/router";

// Mock useRouter
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Navigation Component", () => {
  test("renders the site name", () => {
    // Provide a mocked router value
    useRouter.mockReturnValue({
      pathname: "/",
    });

    render(<Navigation />);
    expect(screen.getByText(/BrainBytes AI/i)).toBeInTheDocument();
  });
});
