import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, roles } = useSelector((state) => state.auth);

  console.log('User Roles----:', roles);
  console.log('role -------',role);
  
  console.log('Is Authenticated-----:', isAuthenticated);

  // Check if the user is authenticated and has the required role
  const hasAccess = isAuthenticated && roles.includes(role);

  return hasAccess ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
