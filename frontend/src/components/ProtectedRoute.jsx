import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children; 
};

export default ProtectedRoute;