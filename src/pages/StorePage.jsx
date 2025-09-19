import React, { useState, useEffect } from "react";
import {
  getAllSweets,
  addSweet,
  updateSweet,
  deleteSweet,
  restockSweet
} from "../services/api";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Image,
} from "react-bootstrap";
import Edit from "./Edit"; // 👈 import the Edit component

export default function StorePage() {
  const [sweets, setSweets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });
  const [images, setImages] = useState([]);
  const [editingSweet, setEditingSweet] = useState(null); // 👈 new state
  const token = localStorage.getItem("token");
  const [restockingSweet, setRestockingSweet] = useState(null);
  const [restockQty, setRestockQty] = useState(0);


  const fetchSweets = async () => {
    const data = await getAllSweets();
    setSweets(data);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    images.forEach((img) => formData.append("images", img));

    await addSweet(formData, token);
    fetchSweets();
    setForm({ name: "", category: "", price: "", quantity: "" });
    setImages([]);
  };

  const handleDelete = async (id) => {
    await deleteSweet(id, token);
    fetchSweets();
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet); // 👈 open Edit overlay
  };

  return (
    <Container style={{ marginTop: "100px" }}>
      {/* If editingSweet is not null, show Edit overlay */}
      {editingSweet && (
        <Edit
          sweet={editingSweet}
          token={token}
          onClose={() => setEditingSweet(null)}
          onUpdated={fetchSweets}
        />
      )}

      {/* If restockingSweet is not null, show Restock overlay */}
{restockingSweet && (
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
        <Col md={6}>
          <Card className="shadow-lg">
            <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
              <span>Restock {restockingSweet.name}</span>
              <Button
                variant="light"
                size="sm"
                onClick={() => setRestockingSweet(null)}
              >
                ✖
              </Button>
            </Card.Header>
            <Card.Body>
              <Form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (restockQty <= 0)
                    return alert("Enter valid quantity");
                  try {
                    await updateSweet(
                      restockingSweet._id,
                      {
                        quantity:
                          restockingSweet.quantity + Number(restockQty),
                      },
                      token
                    );
                    fetchSweets();
                    setRestockingSweet(null);
                  } catch (err) {
                    console.error(err);
                    alert("Failed to restock");
                  }
                }}
              >
                <Form.Group className="mb-3">
                  <Form.Label>Quantity to add</Form.Label>
                  <Form.Control
                    type="number"
                    value={restockQty}
                    onChange={(e) => setRestockQty(e.target.value)}
                    min={1}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="success" className="w-100">
                  Restock
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
)}

      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold text-center" style={{ color: "#b89446" }}>
             Store Management
          </h2>
          <p className="text-center text-muted">
            Manage sweets like a professional sweet shop
          </p>
        </Col>
      </Row>

      {/* Add Sweet Form */}
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-dark text-white">
              Add New Sweet
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleAdd}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter sweet name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Category"
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Price ($)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Price"
                        value={form.price}
                        onChange={(e) =>
                          setForm({ ...form, price: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Quantity"
                        value={form.quantity}
                        onChange={(e) =>
                          setForm({ ...form, quantity: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Upload Images</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={(e) => setImages([...e.target.files])}
                  />
                </Form.Group>

                <Button type="submit" variant="success" className="w-100">
                  + Add Sweet
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sweet List */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white">
              Sweet Inventory
            </Card.Header>
            <Card.Body>
              {sweets.length === 0 ? (
                <p className="text-center text-muted">No sweets available</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sweets.map((s) => (
                      <tr key={s._id}>
                        <td>
                          {s.imageUrls?.[0] ? (
                            <Image
                              src={s.imageUrls[0]}
                              alt={s.name}
                              rounded
                              width={60}
                              height={60}
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <span className="text-muted">No Image</span>
                          )}
                        </td>
                        <td>{s.name}</td>
                        <td>{s.category}</td>
                        <td>${s.price}</td>
                        <td>{s.quantity}</td>
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(s)} // 👈 pass sweet object
                          >
                            <i class="fa-solid fa-pen-to-square"></i>
                            Edit
                          </Button>

                          <Button
                            variant="info"
                            size="sm"
                            className="me-2"
                            onClick={() => {
                              setRestockingSweet(s);  // open restock overlay
                              setRestockQty(0);        // reset qty input
                            }}
                          >
                            <i className="fa-solid fa-arrow-up"></i> Restock
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(s._id)}
                          >
                            <i class="fa-solid fa-trash"></i>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
