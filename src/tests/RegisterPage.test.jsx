// src/tests/RegisterPage.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import RegisterPage from "../pages/RegisterPage";
import * as api from "../services/api";

// Mock react-router-dom entirely
const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => navigateMock,
}));

const renderWithRouter = (ui) => render(ui);

describe("RegisterPage Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    navigateMock.mockClear();
  });

  it("renders all input fields and buttons", () => {
    renderWithRouter(<RegisterPage />);

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/address/i)).toBeInTheDocument();

    // Use getByRole to avoid the multiple element issue
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("navigates to login page when Log In button is clicked", () => {
    renderWithRouter(<RegisterPage />);
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  it("shows alert and navigates on successful registration", async () => {
    vi.spyOn(api, "registerUser").mockResolvedValue({ message: "Registered successfully!" });
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    renderWithRouter(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText(/address/i), { target: { value: "123 Street" } });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(api.registerUser).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        address: "123 Street",
      });
    });

    expect(alertMock).toHaveBeenCalledWith("Registered successfully!");
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  it("shows alert on registration error", async () => {
    vi.spyOn(api, "registerUser").mockRejectedValue(new Error("Registration failed!"));
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    renderWithRouter(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: "failuser" } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "fail@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "failpass" } });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Registration failed!");
    });
  });
});
