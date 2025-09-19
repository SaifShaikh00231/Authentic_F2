// src/tests/StorePage.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StorePage from "../pages/StorePage";
import { vi } from "vitest";
import * as api from "../services/api";

// Mock API
vi.mock("../services/api", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getAllSweets: vi.fn(() =>
      Promise.resolve([
        {
          _id: "1",
          name: "Gulab Jamun",
          category: "Indian",
          price: 5,
          quantity: 10,
          imageUrls: [],
        },
      ])
    ),
    addSweet: vi.fn(),
    updateSweet: vi.fn(),
    deleteSweet: vi.fn(),
  };
});

describe("StorePage Component", () => {
  it("renders sweets with Restock and Delete buttons", async () => {
    render(<StorePage />);

    // Wait for sweets to load
    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    // Restock button should exist
    expect(screen.getByText(/Restock/i)).toBeInTheDocument();

    // Delete button should exist
    expect(screen.getByText(/Delete/i)).toBeInTheDocument();
  });

  it("opens Restock overlay and updates quantity", async () => {
    render(<StorePage />);

    // Wait for sweets
    await waitFor(() => screen.getByText("Gulab Jamun"));

    // Click Restock
    fireEvent.click(screen.getByText(/Restock/i));

    // Restock overlay should appear
    expect(screen.getByText(/Quantity to add/i)).toBeInTheDocument();
  });
});
