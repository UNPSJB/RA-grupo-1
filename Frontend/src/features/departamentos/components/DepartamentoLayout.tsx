import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from '../../../components/layout/Navbar/Navbar';

export const DepartamentoLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const departamentoNavLinks = [
    { to: "/departamento", label: "Panel Principal"},
    { to: "/departamento/gestion-preguntas", label: "Gestión de Preguntas" },
    { to: "/departamento/gestion-encuestas", label: "Gestión de Encuestas" },
    { 
      to: "#", 
      label: "Cerrar Sesión",
      onClick: handleLogout 
    }
  ];

  return (
    <div className="departamento-layout">
      <Navbar 
        rol="departamento_alumnos" 
        navLinks={departamentoNavLinks}
        showUserInfo={false}
      />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};