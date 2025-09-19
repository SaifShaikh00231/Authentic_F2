import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api"; // ✅ import API

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Logging in with:", formData);
      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Login successful!");

      // 🚀 Notify Navbar
      window.dispatchEvent(new Event("userLoggedIn"));

      navigate("/"); // go to homepage
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100 justify-content-center">
        {/* Login Section */}
        <Col md={5} className="mb-5">
          <div className="text-center mb-4">
            <h2 style={{ fontWeight: "700", color: "#1a2a44" }}>Log In</h2>
          </div>
          <h4 style={{ fontWeight: "500", color: "#1a2a44" }}>Log In</h4>
          <Form className="mt-3" onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              style={{
                backgroundColor: "#b89446",
                border: "none",
                padding: "12px 40px",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Sign In
            </Button>
          </Form>
        </Col>

        {/* New Customer Section */}
        <Col md={5}>
          <h4 style={{ fontWeight: "500", color: "#1a2a44" }}>New Customer</h4>
          <p className="mt-3" style={{ fontSize: "16px", color: "#000" }}>
            Sign up for early Sale access plus tailored new arrivals, trends and
            promotions. To opt out, click unsubscribe in our emails.
          </p>
          <Button
            style={{
              backgroundColor: "#b89446",
              border: "none",
              padding: "12px 40px",
              fontSize: "16px",
              fontWeight: "500",
            }}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Col>
      </Row>
    </Container>
  );
}