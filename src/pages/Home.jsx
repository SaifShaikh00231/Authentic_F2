import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Form, InputGroup, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { getAllSweets, purchaseSweet } from "../services/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const sweets = await getAllSweets();
        setProducts(sweets);

        const initialQuantities = {};
        sweets.forEach((p) => {
          initialQuantities[p._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching sweets:", error.message);
      }
    };

    fetchSweets();
  }, []);

  const incrementQty = (id) => {
    setQuantities((prev) => {
      const currentQty = prev[id] || 1;
      if (currentQty < 10) return { ...prev, [id]: currentQty + 1 };
      return prev;
    });
  };

  const decrementQty = (id) => {
    setQuantities((prev) => {
      const currentQty = prev[id] || 1;
      if (currentQty > 1) return { ...prev, [id]: currentQty - 1 };
      return prev;
    });
  };

  const handlePurchaseClick = (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Please log in first to purchase.");
      return;
    }
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedProduct) return;
    try {
      const qty = quantities[selectedProduct._id] || 1;
      const token = localStorage.getItem("token");

      if (!token) {
        alert("⚠️ Please log in first to purchase.");
        return;
      }

      await purchaseSweet(selectedProduct._id, { quantity: qty, address }, token);

      alert("✅ Your order has been booked!");
      setShowModal(false);
      setAddress("");
    } catch (error) {
      alert("❌ Failed to place order: " + error.message);
    }
  };

  // Framer Motion animations
  const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <>
      <Row className="g-4 mb-5">
        {products.map((product, index) => (
          <Col md={6} lg={4} key={product._id}>
            <motion.div
              variants={cardVariant}
              initial="hidden"
              animate="show"
              transition={{ delay: index * 0.15 }}
              whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: "0 10px 25px rgba(255, 193, 7, 0.35)",
              }}
            >
              <Card className="h-100 shadow-sm border-0 rounded-4 sweet-card position-relative">
                {/* floating sweet background */}
                <motion.div
                  className="floating-sweet"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  🍬
                </motion.div>

                <div
                  className="d-flex justify-content-center align-items-center p-3 bg-light rounded-top"
                  style={{ height: "200px" }}
                >
                  {product.imageUrls?.length > 0 ? (
                    <motion.img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="sweet-image"
                      loading="lazy"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>

                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title
                    className="text-center mb-1 text-truncate sweet-title"
                    title={product.name}
                  >
                    {product.name}
                  </Card.Title>
                  <Card.Text className="text-center text-warning fw-semibold fs-5 mb-3 sweet-price">
                    ₹{product.price}
                  </Card.Text>

                  <Form>
                    <Row className="mb-3">
                      <Col xs={12}>
                        <Form.Select defaultValue="200g" className="shadow-sm rounded-pill">
                          <option value="200g">200g</option>
                          <option value="500g">500g</option>
                          <option value="1kg">1kg</option>
                        </Form.Select>
                      </Col>
                    </Row>

                    <Row className="align-items-center">
                      <Col xs={4}>
                        <InputGroup className="quantity-selector shadow-sm rounded-pill overflow-hidden">
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => decrementQty(product._id)}
                            disabled={quantities[product._id] <= 1}
                            aria-label="Decrease quantity"
                            className="quantity-btn"
                          >
                            −
                          </Button>
                          <Form.Control
                            value={quantities[product._id] || 1}
                            size="sm"
                            readOnly
                            className="text-center border-0 quantity-input"
                          />
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => incrementQty(product._id)}
                            disabled={quantities[product._id] >= 10}
                            aria-label="Increase quantity"
                            className="quantity-btn"
                          >
                            +
                          </Button>
                        </InputGroup>
                      </Col>
                      <Col xs={8}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Button
                            variant="warning"
                            className="w-100 fw-semibold purchase-btn"
                            onClick={() => handlePurchaseClick(product)}
                          >
                            Purchase
                          </Button>
                        </motion.div>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Purchase Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="sweet-modal-title">Confirm Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <p>
                <strong>Sweet:</strong> {selectedProduct.name}
              </p>
              <p>
                <strong>Price:</strong> ₹{selectedProduct.price}
              </p>
              <p>
                <strong>Quantity:</strong> {quantities[selectedProduct._id] || 1}
              </p>
              <Form.Group>
                <Form.Label>Delivery Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                />
              </Form.Group>
              <Button variant="dark" className="mt-3 w-100">
                Cash on Delivery (COD)
              </Button>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleConfirmPurchase}>
            Confirm Order
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Playfair+Display+SC:wght@700&display=swap");

        .sweet-card {
          background: #fffdf8;
          position: relative;
          overflow: hidden;
        }
        .floating-sweet {
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: 1.4rem;
          opacity: 0.3;
        }
        .sweet-image {
          max-height: 170px;
          max-width: 100%;
          object-fit: contain;
          border-radius: 12px;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15));
        }
        .no-image {
          height: 150px;
          background-color: #f8f8f8;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #bbb;
          font-size: 1.1rem;
          font-style: italic;
        }
        .sweet-title {
          font-family: "Playfair Display SC", serif;
          font-size: 1.3rem;
          font-weight: 700;
        }
        .sweet-price {
          font-family: "Poppins", sans-serif;
          font-size: 1.15rem;
        }
        .quantity-selector {
          border: 1px solid #ffc107;
          height: 36px;
        }
        .quantity-btn {
          border: none;
          width: 36px;
          height: 36px;
          font-weight: bold;
          color: #ffc107;
          font-size: 1.2rem;
        }
        .quantity-input {
          width: 45px;
          background: transparent;
          font-weight: 600;
          color: #333;
        }
        .purchase-btn {
          border-radius: 50px;
          font-family: "Poppins", sans-serif;
        }
        .sweet-modal-title {
          font-family: "Playfair Display SC", serif;
        }
      `}</style>
    </>
  );
};

export default Home;
