import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user!.role)) {
    // Redirigir al panel correspondiente según el rol
    const roleRoutes: Record<string, string> = {
      'alumno': '/alumno/panel',
      'docente': '/docente',
      'departamento': '/departamento/informes/sinteticos',
      'secretaria_academica': '/secretaria/gestion-encuestas'
    };
    
    return <Navigate to={roleRoutes[user!.role] || '/login'} replace />;
  }

  return <>{children}</>;
};