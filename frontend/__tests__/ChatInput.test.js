import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import ChatInput from "../components/ChatInput";

describe("ChatInput", () => {
  test("calls onSend with valid input", () => {
    const mockSend = jest.fn();
    render(<ChatInput onSend={mockSend} />);

    const input = screen.getByPlaceholderText("Type a message...");
    const button = screen.getByText("Send");

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(button);

    expect(mockSend).toHaveBeenCalledWith("Hello");
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test("does not call onSend when input is empty", () => {
    const mockSend = jest.fn();
    render(<ChatInput onSend={mockSend} />);

    const button = screen.getByText("Send");
    fireEvent.click(button);

    expect(mockSend).not.toHaveBeenCalled();
  });
});