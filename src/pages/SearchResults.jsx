import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Form, InputGroup } from "react-bootstrap";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const storedResults = localStorage.getItem("searchResults");
    if (storedResults) {
      const parsed = JSON.parse(storedResults);
      setResults(parsed);
      const initialQuantities = {};
      parsed.forEach((p) => {
        initialQuantities[p._id] = 1;
      });
      setQuantities(initialQuantities);
    }
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

  const handleAddToCart = (product) => {
    console.log("Add to cart:", product, "Quantity:", quantities[product._id]);
    // add cart logic here
  };

  if (results.length === 0) {
    return <p className="text-center mt-5">No sweets found.</p>;
  }

  return (
    <div className="search-results-wrapper">
      <Row className="g-4">
        {results.map((product) => (
          <Col xs={12} sm={6} md={6} lg={4} key={product._id}>
            {/* Prevent card clicks from navigating or clearing page */}
            <Card
              className="h-100 shadow-sm border-0 rounded-3 sweet-card"
              onClick={(e) => e.preventDefault()}
              tabIndex={-1}
            >
              <div
                className="d-flex justify-content-center align-items-center p-3 bg-light rounded-top"
                style={{ height: "180px" }}
              >
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="sweet-image"
                    loading="lazy"
                  />
                ) : (
                  <div
                    style={{
                      height: "150px",
                      backgroundColor: "#f8f8f8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "10px",
                      color: "#bbb",
                      fontSize: "1.1rem",
                      fontStyle: "italic",
                    }}
                  >
                    No Image
                  </div>
                )}
              </div>

              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title
                  className="text-center fw-bold fs-5 mb-1 text-truncate"
                  title={product.name}
                >
                  {product.name}
                </Card.Title>
                <Card.Text className="text-center text-warning fw-semibold fs-5 mb-3">
                  ₹{product.price}
                </Card.Text>

                <Form>
                  <Row className="mb-3">
                    <Col xs={12}>
                      <Form.Select defaultValue="200g" className="shadow-sm">
                        <option value="200g">200g</option>
                        <option value="500g">500g</option>
                        <option value="1kg">1kg</option>
                      </Form.Select>
                    </Col>
                  </Row>

                  <Row className="align-items-center g-2">
                    <Col xs={12} sm={4}>
                      <InputGroup className="quantity-selector shadow-sm rounded-pill overflow-hidden w-100">
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
                    <Col xs={12} sm={8}>
                      <Button
                        variant="warning"
                        className="w-100 fw-semibold"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to cart
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <style jsx>{`
        :root {
          --header-height: 120px;
          --vh: 1px;
        }

        .search-results-wrapper {
          padding: 10px;
          box-sizing: border-box;
          height: calc(var(--vh) * 100 - var(--header-height));
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .sweet-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: default; /* no pointer cursor */
        }
        .sweet-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 20px rgba(255, 193, 7, 0.3);
        }
        .sweet-image {
          width: 100%;
          max-height: 160px;
          object-fit: contain;
          border-radius: 10px;
          filter: drop-shadow(0 2px 4px rgb(0 0 0 / 0.1));
          transition: transform 0.3s ease;
        }
        .sweet-image:hover {
          transform: scale(1.05);
        }
        .quantity-selector {
          background-color: #fff;
          border: 1px solid #ffc107;
          display: flex;
          align-items: center;
          padding: 0;
          height: 32px;
        }
        .quantity-btn {
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 0;
          font-weight: bold;
          color: #ffc107;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.2rem;
          line-height: 1;
          user-select: none;
        }
        .quantity-btn:hover:not(:disabled) {
          background-color: #fff3e0;
          color: #e0a800;
        }
        .quantity-btn:disabled {
          color: #f8c471;
          cursor: not-allowed;
        }
        .quantity-input {
          width: 40px;
          border-radius: 0;
          background: transparent;
          font-weight: 600;
          color: #333;
          pointer-events: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default SearchResults;
