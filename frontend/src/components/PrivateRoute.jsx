import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowedRoles, user }) {
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Si el usuario no tiene el rol adecuado, lo mandamos a login
    return <Navigate to="/login" />;
  }
  return children;
}
