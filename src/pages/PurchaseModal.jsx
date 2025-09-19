import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { purchaseSweet, restockSweet } from "../services/api";

const PurchaseModal = ({ show, onHide, sweet, user, refreshData }) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const increment = () => {
    if (quantity < 10) setQuantity((q) => q + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handlePurchase = async () => {
    if (!address.trim()) {
      alert("Please enter your address.");
      return;
    }
    setLoading(true);
    try {
      await purchaseSweet(sweet._id, { quantity, address });
      alert("✅ Your order is booked!");
      onHide();
      if (refreshData) refreshData();
    } catch (err) {
      console.error(err);
      alert("❌ Purchase failed. Try again.");
    }
    setLoading(false);
  };

  const handleRestock = async () => {
    setLoading(true);
    try {
      await restockSweet(sweet._id, { quantity });
      alert("✅ Sweet restocked successfully!");
      onHide();
      if (refreshData) refreshData();
    } catch (err) {
      console.error(err);
      alert("❌ Restock failed.");
    }
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      {sweet && (
        <>
          <Modal.Header closeButton>
            <Modal.Title>Purchase Sweet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center mb-3">
              <img
                src={
                  sweet.imageUrls?.[0] ||
                  "https://via.placeholder.com/120?text=No+Image"
                }
                alt={sweet.name}
                style={{ width: "120px", height: "120px", objectFit: "contain" }}
              />
              <h5 className="mt-2">{sweet.name}</h5>
              <p className="text-warning fw-semibold">₹{sweet.price}</p>
            </div>

            {/* Quantity */}
            <InputGroup className="mb-3">
              <Button variant="outline-warning" onClick={decrement} disabled={quantity <= 1}>
                −
              </Button>
              <Form.Control
                type="text"
                value={quantity}
                readOnly
                className="text-center"
              />
              <Button variant="outline-warning" onClick={increment} disabled={quantity >= 10}>
                +
              </Button>
            </InputGroup>

            {/* Address */}
            <Form.Group className="mb-3">
              <Form.Label>Delivery Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {user?.role === "admin" ? (
              <Button
                variant="success"
                onClick={handleRestock}
                disabled={loading}
              >
                {loading ? "Restocking..." : "Restock"}
              </Button>
            ) : (
              <>
                <Button
                  variant="warning"
                  onClick={handlePurchase}
                  disabled={loading}
                >
                  {loading ? "Booking..." : "Confirm COD"}
                </Button>
              </>
            )}
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default PurchaseModal;
