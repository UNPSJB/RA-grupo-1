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
        <>
          {/* Header con saludo */}
          <div className="dashboard-header">
            <Container>
              <div className="header-content animate-fade-in">
                <div className="d-flex align-items-center">
                  <img 
                    src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" 
                    width="35"
                    className="me-2"
                    alt="mano saludando"
                  />
                  <div>
                    <h4 className="text-white mb-1">¡Bienvenido, Docente!</h4>
                    <p className="text-white-75 mb-0 small">Aquí tienes un resumen de tu actividad</p>
                  </div>
                </div>
              </div>
            </Container>
          </div>

          {/* Resumen de Métricas - FIJO */}
          <div className="metricas-section">
            <Container>
              <Row className="g-3">
                {metricas.map((metrica, index) => (
                  <Col key={index} xs={12} sm={6} lg={3}>
                    <Card className={`metrica-card shadow-sm animate-slide-up delay-${index}`}>
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-start">
                          <div className={`icon-wrapper type-${metrica.type} me-3`}>
                            <i className={`bi ${metrica.icono}`}></i>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="text-muted mb-1 small">{metrica.titulo}</h6>
                            <h3 className="mb-0 fw-bold">{metrica.valor}</h3>
                            <p className="description-text mb-0 mt-1">{metrica.descripcion}</p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
          </div>
        </>
      )}

      {/* Contenido Principal */}
      <main className="docente-main-content">
        <Container className={`py-4 ${isDashboard ? 'content-wrapper-dashboard' : 'content-wrapper'}`}>
          <Outlet />
        </Container>
      </main>

      <Footer />
    </div>
  );
};