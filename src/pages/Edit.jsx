import React, { useState } from "react";
import { updateSweet } from "../services/api";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

export default function Edit({ sweet, token, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: sweet.name,
    category: sweet.category,
    price: sweet.price,
    quantity: sweet.quantity,
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "price" || key === "quantity") {
        formData.append(key, Number(form[key]));
      } else {
        formData.append(key, form[key]);
      }
    });

    images.forEach((img) => formData.append("images", img));

    try {
      await updateSweet(sweet._id, formData, token);
      onUpdated(); // refresh sweets list
      onClose();   // close edit page
    } catch (err) {
      console.error("Error updating sweet:", err.message);
      alert("❌ Failed to update sweet: " + err.message);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 1050,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflowY: "auto",
      }}
    >
      <Container style={{ marginTop: "50px" }}>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-lg">
              <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                <span>Edit Sweet</span>
                <Button variant="light" size="sm" onClick={onClose}>
                  ✖
                </Button>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="name">Name</Form.Label>
                    <Form.Control
                      id="name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="category">Category</Form.Label>
                    <Form.Control
                      id="category"
                      type="text"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="price">Price (₹)</Form.Label>
                        <Form.Control
                          id="price"
                          type="number"
                          name="price"
                          value={form.price}
                          onChange={handleChange}
                          min="1"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="quantity">Quantity</Form.Label>
                        <Form.Control
                          id="quantity"
                          type="number"
                          name="quantity"
                          value={form.quantity}
                          onChange={handleChange}
                          min="1"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="images">Upload New Images</Form.Label>
                    <Form.Control
                      id="images"
                      type="file"
                      multiple
                      onChange={(e) => setImages([...e.target.files])}
                    />
                    <small className="text-muted">
                      Leave empty if you don’t want to change images.
                    </small>
                  </Form.Group>

                  <Button type="submit" variant="success" className="w-100">
                    Save Changes
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
