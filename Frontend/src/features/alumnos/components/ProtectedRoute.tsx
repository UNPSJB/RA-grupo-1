import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"

interface Props {
  children: JSX.Element;
  allowedRoles?: string[]; // si no se pasa, cualquier usuario autenticado
}

export const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Opcional: redirigir a su panel por rol
    if (user.role === "alumno") return <Navigate to="/alumno/panel" replace />;
    if (user.role === "docente") return <Navigate to="/docente/panel" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};
