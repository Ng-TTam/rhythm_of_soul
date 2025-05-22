import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "../utils/tokenManager";

// Giả sử bạn lấy thông tin người dùng từ localStorage hoặc Redux/Context
const getCurrentUserRole = () => {
  return getUserRole(); // "ADMIN", "USER", "ARTIST", etc.
};

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const role = getCurrentUserRole();

  if (!role) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
