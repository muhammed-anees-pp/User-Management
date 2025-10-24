import React from "react";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const isAuth = !!localStorage.getItem("access");
  if (isAuth) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

export default PublicRoute;