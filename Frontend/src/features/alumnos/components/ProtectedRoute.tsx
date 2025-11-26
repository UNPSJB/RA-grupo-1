import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('alumno_token');
  const alumnoId = localStorage.getItem('alumno_id');

  if (!token || !alumnoId) {
    return <Navigate to="/alumno/login" replace />;
  }

  return <>{children}</>;
};