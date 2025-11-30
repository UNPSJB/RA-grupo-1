import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRouteDocente = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('docente_token');
  const docenteId = localStorage.getItem('docente_id');

  if (!token || !docenteId) {
    return <Navigate to="/docente/login" replace />;
  }

  return <>{children}</>;
};