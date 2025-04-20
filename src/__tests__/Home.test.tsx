import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import Home from "@/app/page";
import userEvent from "@testing-library/user-event";

describe("Home Page Integration", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    window.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("disables Sync button when no data", () => {
    render(<Home />);
    expect(screen.getByRole("button", { name: /Sync to CRM/i })).toBeDisabled();
  });

  it("renders patient table from upload", async () => {
    const { container } = render(<Home />);

    const csvContent = `EHR ID,Patient Name,Email,Phone,Referring Provider
123,John A,hello@example.com,1234567890,Dr. Nice`;

    const file = new File([csvContent], "mock.csv", { type: "text/csv" });
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    if (!input) {
      throw new Error("File input element not found");
    }
    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/John A/i)).toBeInTheDocument();
      expect(screen.getByText(/hello@example.com/i)).toBeInTheDocument();
    });
  });
});
