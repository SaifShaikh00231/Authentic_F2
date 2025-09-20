import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { getAllSweets, purchaseSweet } from "../services/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [address, setAddress] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [showFilter, setShowFilter] = useState(false); // toggle filter panel

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const sweets = await getAllSweets();
        setProducts(sweets);

        const highestPrice = Math.max(...sweets.map((s) => s.price), 1000);
        setMaxPrice(highestPrice);
        setPriceRange([0, highestPrice]);

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

      await purchaseSweet(
        selectedProduct._id,
        { quantity: qty, address },
        token
      );

      alert("✅ Your order has been booked!");
      setShowModal(false);
      setAddress("");
    } catch (error) {
      alert("❌ Failed to place order: " + error.message);
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const filteredProducts = products.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  return (
    <>
      {/* Filter Toggle */}
{/* Filter Button + Active Filter Badge */}
<div className="d-flex align-items-center my-3 mx-3 gap-2">
  {/* Filter Button */}
  <Button
    variant="outline-warning"
    className="rounded-pill px-3 d-flex align-items-center gap-2 shadow-sm"
    onClick={() => setShowFilter(!showFilter)}
  >
    <i className="fa-solid fa-filter"></i>
    <span className="fw-semibold">Filter</span>
  </Button>

  {/* Active Filter Badge */}
  {(priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
    <div className="d-flex align-items-center bg-warning text-dark px-3 py-1 rounded-pill shadow-sm gap-2">
      <span className="fw-semibold">
        ₹{priceRange[0]} - ₹{priceRange[1]}
      </span>
      <Button
        size="sm"
        variant="light"
        className="rounded-circle d-flex align-items-center justify-content-center"
        style={{ width: "20px", height: "20px", fontSize: "1rem" }}
        onClick={() => setPriceRange([0, maxPrice])}
      >
        ×
      </Button>
    </div>
  )}
</div>


      {/* Price Filter Panel */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <Card className="shadow-sm border-0 rounded-4 p-1">
              <Card.Body>
                <Form>
                  <Row className="align-items-center">
                    <Col xs={12} md={4}>
                      <Form.Label className="fw-semibold">
                        💰 Price Range
                      </Form.Label>
                    </Col>
                    <Col xs={12} md={4}>
                      <Form.Range
                        min={0}
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], +e.target.value])
                        }
                        className="my-3 price-slider"
                      />

                      <InputGroup className="w-100">
                        <div className="d-flex align-items-center gap-2 w-100">
                          <Form.Control
                            type="number"
                            min="0"
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(e) =>
                              setPriceRange([+e.target.value, priceRange[1]])
                            }
                            className="shadow-sm flex-grow-1"
                          />
                          <span className="mx-1 fw-semibold">To</span>
                          <Form.Control
                            type="number"
                            min={priceRange[0]}
                            max={maxPrice}
                            value={priceRange[1]}
                            onChange={(e) =>
                              setPriceRange([priceRange[0], +e.target.value])
                            }
                            className="shadow-sm flex-grow-1"
                          />
                        </div>
                      </InputGroup>

                      <div className="d-flex justify-content-between small text-muted">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products */}
      <Row className="g-4 mb-5">
        {filteredProducts.map((product, index) => (
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
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
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
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
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
                        <Form.Select
                          defaultValue="200g"
                          className="shadow-sm rounded-pill"
                        >
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
        {filteredProducts.length === 0 && (
          <p className="text-center text-muted mt-4">
            No products in this price range.
          </p>
        )}
      </Row>

      {/* Purchase Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="sweet-modal-title">
            Confirm Purchase
          </Modal.Title>
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
                <strong>Quantity:</strong>{" "}
                {quantities[selectedProduct._id] || 1}
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

        .price-slider {
          accent-color: #ffc107; /* modern browsers */
          height: 6px;
          border-radius: 4px;
          background: linear-gradient(
            to right,
            #ffc107 0%,
            #ffc107 ${(priceRange[1] / maxPrice) * 100}%,
            #e9ecef ${(priceRange[1] / maxPrice) * 100}%,
            #e9ecef 100%
          );
        }

        .price-slider::-webkit-slider-thumb {
          background: #ffc107;
          border: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease;
        }

        .price-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .price-slider::-moz-range-thumb {
          background: #ffc107;
          border: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease;
        }
      `}</style>
    </>
  );
};

export default Home;
