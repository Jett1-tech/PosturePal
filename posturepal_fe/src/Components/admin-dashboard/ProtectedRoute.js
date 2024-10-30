import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Nếu không có token, chuyển hướng đến trang đăng nhập
    return <Navigate to="/admin" replace />;
  }

  return element;
};

export default ProtectedRoute;
