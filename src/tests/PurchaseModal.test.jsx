import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PurchaseModal from "../pages/PurchaseModal";

// Mock API functions
vi.mock("../services/api", () => ({
  purchaseSweet: vi.fn(() => Promise.resolve()),
  restockSweet: vi.fn(() => Promise.resolve()),
}));

describe("PurchaseModal Component", () => {
  const sweet = {
    _id: "1",
    name: "Burfi",
    price: 100,
    imageUrls: ["https://via.placeholder.com/120"],
  };

  const user = { role: "user" };
  const adminUser = { role: "admin" };
  const onHide = vi.fn();

  it("renders sweet details", () => {
    render(<PurchaseModal show={true} onHide={onHide} sweet={sweet} user={user} />);

    expect(screen.getByText("Burfi")).toBeInTheDocument();
    expect(screen.getByText("₹100")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm COD" })).toBeInTheDocument();
  });

  it("increments and decrements quantity", () => {
    render(<PurchaseModal show={true} onHide={onHide} sweet={sweet} user={user} />);

    const quantityInput = screen.getByDisplayValue("1"); // targets the quantity input
    const incrementBtn = screen.getByText("+");
    const decrementBtn = screen.getByText("−");

    // increment
    fireEvent.click(incrementBtn);
    expect(quantityInput.value).toBe("2");

    // decrement
    fireEvent.click(decrementBtn);
    expect(quantityInput.value).toBe("1");
  });

  it("renders Restock button for admin", () => {
    render(<PurchaseModal show={true} onHide={onHide} sweet={sweet} user={adminUser} />);

    expect(screen.getByRole("button", { name: "Restock" })).toBeInTheDocument();
  });
});
