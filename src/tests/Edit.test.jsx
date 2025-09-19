// src/tests/Edit.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Edit from "../pages/Edit";
import * as api from "../services/api";

describe("Edit Component", () => {
  const sweet = {
    _id: "1",
    name: "Chocolate",
    category: "Candy",
    price: 50,
    quantity: 10,
  };
  const token = "fake-token";
  const onClose = vi.fn();
  const onUpdated = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    onClose.mockClear();
    onUpdated.mockClear();
  });

  it("renders all form fields with initial sweet values", () => {
    render(<Edit sweet={sweet} token={token} onClose={onClose} onUpdated={onUpdated} />);

    expect(screen.getByLabelText(/name/i)).toHaveValue("Chocolate");
    expect(screen.getByLabelText(/category/i)).toHaveValue("Candy");
    expect(screen.getByLabelText(/price/i)).toHaveValue(50);
    expect(screen.getByLabelText(/quantity/i)).toHaveValue(10);
    expect(screen.getByText(/save changes/i)).toBeInTheDocument();
    expect(screen.getByText(/✖/i)).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<Edit sweet={sweet} token={token} onClose={onClose} onUpdated={onUpdated} />);
    fireEvent.click(screen.getByText(/✖/i));
    expect(onClose).toHaveBeenCalled();
  });

  it("updates form values on input change", () => {
    render(<Edit sweet={sweet} token={token} onClose={onClose} onUpdated={onUpdated} />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Vanilla" } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: 60 } });
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: 5 } });

    expect(screen.getByLabelText(/name/i)).toHaveValue("Vanilla");
    expect(screen.getByLabelText(/price/i)).toHaveValue(60);
    expect(screen.getByLabelText(/quantity/i)).toHaveValue(5);
  });

  it("submits form successfully and calls onUpdated and onClose", async () => {
    vi.spyOn(api, "updateSweet").mockResolvedValue({});
    render(<Edit sweet={sweet} token={token} onClose={onClose} onUpdated={onUpdated} />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Vanilla" } });
    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(api.updateSweet).toHaveBeenCalled();
      expect(onUpdated).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("shows alert if updateSweet fails", async () => {
    const error = new Error("Update failed");
    vi.spyOn(api, "updateSweet").mockRejectedValue(error);
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<Edit sweet={sweet} token={token} onClose={onClose} onUpdated={onUpdated} />);

    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("❌ Failed to update sweet: Update failed");
    });
  });
});
