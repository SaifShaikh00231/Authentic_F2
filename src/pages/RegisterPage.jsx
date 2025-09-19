import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api"; // ✅ import api

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Registering user:", formData);
      const data = await registerUser(formData);
      alert(data.message || "Registered successfully!");
      navigate("/login"); // Redirect after successful registration
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", padding: "20px" }}
    >
      <div
        className="w-100"
        style={{ maxWidth: "500px", backgroundColor: "#fff", padding: "40px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <h1 className="text-center fw-bold mb-4">Register</h1>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              className="form-control rounded-0"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <input
              type="password"
              className="form-control rounded-0"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Register button */}
          <button
            type="submit"
            className="btn w-100 text-white fw-semibold mb-3"
            style={{ backgroundColor: "#c6a340" }}
          >
            Register
          </button>

          {/* Login button */}
          <button
            type="button"
            className="btn w-100 fw-semibold"
            style={{
              backgroundColor: "transparent",
              border: "1px solid #c6a340",
              color: "#c6a340",
            }}
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
