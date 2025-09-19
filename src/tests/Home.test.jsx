// src/tests/Home.test.jsx
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import Home from "../pages/Home";
import { BrowserRouter } from "react-router-dom";
import * as api from "../services/api";

// Mock the API functions using Vitest
vi.mock("../services/api");

describe("Home Component", () => {
  const mockProducts = [
    {
      _id: "1",
      name: "Gulab Jamun",
      price: 100,
      imageUrls: ["https://via.placeholder.com/150"],
    },
    { _id: "2", name: "Rasgulla", price: 80, imageUrls: [] },
  ];

  beforeEach(() => {
    api.getAllSweets.mockResolvedValue(mockProducts);
    api.purchaseSweet.mockResolvedValue({});
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

  it("renders Home component and products", async () => {
    renderComponent();

    for (const product of mockProducts) {
      expect(await screen.findByText(product.name)).toBeInTheDocument();
      expect(screen.getByText(`₹${product.price}`)).toBeInTheDocument();
    }
  });

  it("increments and decrements quantity correctly", async () => {
    renderComponent();

    const incrementBtn = await screen.findAllByLabelText("Increase quantity");
    const decrementBtn = screen.getAllByLabelText("Decrease quantity");

    // Instead of spinbutton, use the input by its class
    const qtyInputs = screen.getAllByDisplayValue("1"); // all quantity inputs start at 1

    expect(qtyInputs[0].value).toBe("1");

    fireEvent.click(incrementBtn[0]);
    expect(qtyInputs[0].value).toBe("2");

    fireEvent.click(decrementBtn[0]);
    expect(qtyInputs[0].value).toBe("1");
  });

  it("shows alert if user not logged in when purchasing", async () => {
    renderComponent();

    const purchaseButtons = await screen.findAllByText("Purchase");
    fireEvent.click(purchaseButtons[0]);

    expect(window.alert).toHaveBeenCalledWith(
      "⚠️ Please log in first to purchase."
    );
  });

  it("opens modal when user logged in", async () => {
    localStorage.setItem("token", "mock-token");
    renderComponent();

    const purchaseButtons = await screen.findAllByText("Purchase");
    fireEvent.click(purchaseButtons[0]);

    const modal = screen.getByRole("dialog");
    const modalWithin = within(modal);

    expect(modalWithin.getByText("Confirm Purchase")).toBeInTheDocument();
    expect(modalWithin.getByText(/Gulab Jamun/)).toBeInTheDocument();
    expect(modalWithin.getByText(/₹100/)).toBeInTheDocument();
  });

  it("confirms purchase and calls API", async () => {
    localStorage.setItem("token", "mock-token");
    renderComponent();

    const purchaseButtons = await screen.findAllByText("Purchase");
    fireEvent.click(purchaseButtons[0]);

    const modal = screen.getByRole("dialog");
    const modalWithin = within(modal);

    const addressInput = modalWithin.getByPlaceholderText("Enter your address");
    fireEvent.change(addressInput, { target: { value: "123 Street" } });

    const confirmButton = modalWithin.getByText("Confirm Order");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(api.purchaseSweet).toHaveBeenCalledWith(
        mockProducts[0]._id,
        { quantity: 1, address: "123 Street" },
        "mock-token"
      );
      expect(window.alert).toHaveBeenCalledWith(
        "✅ Your order has been booked!"
      );
    });
  });
});
