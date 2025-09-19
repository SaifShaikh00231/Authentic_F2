import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchResults from "../pages/SearchResults"; // update path if needed

// Mock localStorage
const mockLocalStorage = (data) => {
  Storage.prototype.getItem = vi.fn(() => JSON.stringify(data));
};

describe("SearchResults Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.log = vi.fn(); // mock console.log
  });

  it("renders 'No sweets found' if localStorage is empty", () => {
    Storage.prototype.getItem = vi.fn(() => null);
    render(<SearchResults />);
    expect(screen.getByText("No sweets found.")).toBeInTheDocument();
  });

  it("renders sweet cards from localStorage", () => {
    const sweets = [
      { _id: "1", name: "Burfi", price: 100, imageUrls: ["https://via.placeholder.com/120"] },
      { _id: "2", name: "Ladoo", price: 80, imageUrls: [] },
    ];
    mockLocalStorage(sweets);

    render(<SearchResults />);

    expect(screen.getByText("Burfi")).toBeInTheDocument();
    expect(screen.getByText("₹100")).toBeInTheDocument();
    expect(screen.getByText("Ladoo")).toBeInTheDocument();
    expect(screen.getByText("₹80")).toBeInTheDocument();
    expect(screen.getAllByText("No Image").length).toBe(1);
  });

  it("increments and decrements quantity", () => {
    const sweets = [{ _id: "1", name: "Burfi", price: 100, imageUrls: ["https://via.placeholder.com/120"] }];
    mockLocalStorage(sweets);

    render(<SearchResults />);

    const quantityInput = screen.getByDisplayValue("1");
    const incrementBtn = screen.getByLabelText("Increase quantity");
    const decrementBtn = screen.getByLabelText("Decrease quantity");

    // increment
    fireEvent.click(incrementBtn);
    expect(quantityInput.value).toBe("2");

    // decrement
    fireEvent.click(decrementBtn);
    expect(quantityInput.value).toBe("1");
  });

  it("calls handleAddToCart on Add to cart click", () => {
    const sweets = [{ _id: "1", name: "Burfi", price: 100, imageUrls: ["https://via.placeholder.com/120"] }];
    mockLocalStorage(sweets);

    render(<SearchResults />);

    const addToCartBtn = screen.getByText("Add to cart");
    fireEvent.click(addToCartBtn);

    expect(console.log).toHaveBeenCalledWith(
      "Add to cart:",
      sweets[0],
      "Quantity:",
      1
    );
  });
});
