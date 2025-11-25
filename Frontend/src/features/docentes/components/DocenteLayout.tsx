import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Navbar } from "../../../components/layout/Navbar/Navbar";
import { Footer } from "../../../components/layout/Footer/Footer";
import '../styles/DocenteLayout.css';

export const DocenteLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar si estamos en el dashboard
  const isDashboard = location.pathname === "/docente";

  const handleLogout = () => navigate('/');

  const docenteNavLinks = [
    { to: "/docente", label: "Panel Principal" },
    { to: "/docente/reportes", label: "Reportes" },
    { to: "/docente/informes-finalizados", label: "Informes Finalizados" },
    { to: "/docente/mis-asignaturas", label: "Mis Asignaturas" },
  ];

  const metricas = [
    { titulo: 'Mis Asignaturas', valor: 3, icono: 'bi-journal-text', type: 'primary', descripcion: 'Dictadas este ciclo' },
    { titulo: 'Total Alumnos', valor: 105, icono: 'bi-people', type: 'secondary', descripcion: 'Inscriptos activos' },
    { titulo: 'Encuestas Listas', valor: 85, icono: 'bi-check2-all', type: 'accent', descripcion: 'Respuestas recibidas' },
    { titulo: 'Promedio', valor: '4.2', icono: 'bi-star', type: 'neutral', descripcion: 'Calificación general' }
  ];

  return (
    <div className="docente-layout">
      <Navbar 
        navLinks={docenteNavLinks} 
        showUserInfo={true} 
        rol="docente"
      />

      {isDashboard && (
        <div className="dashboard-header py-5">
          <Container>
            <p className="text-white-85 animate-fade-in delay-1">
              <img 
                src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" 
                width="35"
                style={{ marginRight: "8px" }}
                alt="mano saludando"
              />
              Bienvenido al panel de docente.
            </p>
          </Container>
        </div>
      )}

      <main className="docente-main-content">
        <Container className="py-4 content-wrapper">
          <Outlet />
        </Container>
      </main>

      <Footer />
    </div>
  );
};
