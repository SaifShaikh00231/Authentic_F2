import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { BrowserRouter } from "react-router-dom";

// Helper to wrap in Router
const renderNavbar = () =>
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

describe("Navbar Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders logo and search input", () => {
    renderNavbar();
    expect(screen.getByAltText(/Bombay Sweet Shop/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search for sweets/i)).toBeInTheDocument();
  });

  test("shows Login/Register in dropdown when no user is logged in", async () => {
    renderNavbar();

    // open dropdown (first user icon)
    const toggles = screen.getAllByText((content, element) =>
      element.tagName.toLowerCase() === "span" && element.className.includes("dropdown-toggle")
    );
    fireEvent.click(toggles[0]);

    expect(await screen.findByText(/Login/i)).toBeInTheDocument();
    expect(await screen.findByText(/Register/i)).toBeInTheDocument();
  });

  test("shows username + Logout when a user exists", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ username: "Saif", role: "user" })
    );

    renderNavbar();

    // open dropdown
    const toggles = screen.getAllByText((content, element) =>
      element.tagName.toLowerCase() === "span" && element.className.includes("dropdown-toggle")
    );
    fireEvent.click(toggles[0]);

    expect(await screen.findByText(/Hello, Saif/i)).toBeInTheDocument();
    expect(await screen.findByText(/Logout/i)).toBeInTheDocument();
  });

  test("shows Store link if user is admin", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ username: "Admin", role: "admin" })
    );

    renderNavbar();

    // open dropdown
    const toggles = screen.getAllByText((content, element) =>
      element.tagName.toLowerCase() === "span" && element.className.includes("dropdown-toggle")
    );
    fireEvent.click(toggles[0]);

    expect(await screen.findByText(/Store/i)).toBeInTheDocument();
  });

  test("toggles mobile search overlay", () => {
    renderNavbar();

    const toggleBtn = screen.getByLabelText(/Toggle search/i);
    fireEvent.click(toggleBtn);

    expect(screen.getByRole("search")).toBeInTheDocument();
  });
});
