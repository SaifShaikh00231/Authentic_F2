import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import * as api from "../services/api";

// Mock the API module
vi.mock("../services/api");

// Mock useNavigate from react-router-dom
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("LoginPage Component", () => {
  const MockLogin = () => (
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    navigateMock.mockReset();
  });

  it("renders email, password inputs and buttons", () => {
    render(<MockLogin />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("navigates to register page when Register button is clicked", () => {
    render(<MockLogin />);
    const registerBtn = screen.getByRole("button", { name: /register/i });
    fireEvent.click(registerBtn);
    expect(navigateMock).toHaveBeenCalledWith("/register");
  });

  it("shows alert and stores token/user on successful login", async () => {
    const fakeUser = { id: 1, name: "Test User" };
    api.loginUser.mockResolvedValue({ token: "abc123", user: fakeUser });

    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<MockLogin />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("abc123");
      expect(JSON.parse(localStorage.getItem("user"))).toEqual(fakeUser);
      expect(alertMock).toHaveBeenCalledWith("Login successful!");
      expect(navigateMock).toHaveBeenCalledWith("/");
    });

    alertMock.mockRestore();
  });

  it("navigates to home page if loginRefreshed already set", async () => {
    sessionStorage.setItem("loginRefreshed", "true");
    api.loginUser.mockResolvedValue({ token: "abc123", user: { name: "Test" } });

    render(<MockLogin />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });

  it("shows alert if loginUser throws an error", async () => {
    api.loginUser.mockRejectedValue(new Error("Invalid credentials"));
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<MockLogin />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Invalid credentials");
    });

    alertMock.mockRestore();
  });
});
