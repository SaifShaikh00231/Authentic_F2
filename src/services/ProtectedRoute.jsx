// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    console.error("Invalid user in localStorage:", err);
  }

  if (!user) {
    // Not logged in → send to login
    return <Navigate to="/login" replace />;
  }

  // ✅ only check role, ignore other properties
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // ✅ authorized
  return children;
}
