import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Navbar } from "../../../components/layout/Navbar/Navbar"; 
import { Footer } from "../../../components/layout/Footer/Footer";
import '../styles/Secretaria.css';

export const SecretariaLayout: React.FC = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const handleLogout = () => navigate('/');

  const secretariaNavLinks = [
    { to: "/secretaria", label: "Panel Principal" },
    { to: "/secretaria/gestion-encuestas", label: "Gestion Encuestas" },
    { to: "/secretaria/gestion-preguntas", label: "Gestion Preguntas"},
    { to: "/secretaria/ciclos", label: "Ciclos" },
    { to: "/secretaria/informes-sinteticos", label: "Informes Sintéticos" },
    { to: "#", label: "Cerrar Sesión", onClick: handleLogout }
  ];

  const metricas = [
    { titulo: 'Encuestas Activas', valor: 3, icono: 'bi-clipboard-data', type: 'primary', descripcion: 'En curso actualmente' },
    { titulo: 'Preguntas Disponibles', valor: 15, icono: 'bi-archive', type: 'secondary', descripcion: 'Banco de preguntas' },
    { titulo: 'Respuestas Totales', valor: 245, icono: 'bi-people', type: 'accent', descripcion: 'Participación estudiantil' },
    { titulo: 'Categorías', valor: 7, icono: 'bi-tags', type: 'neutral', descripcion: 'Secciones activas' }
  ];

  const isDashboard = location.pathname === "/secretaria";

  return (
    <div className="secretaria-layout">

      <Navbar 
        navLinks={secretariaNavLinks} 
        showUserInfo={false} 
        rol="secretaria"
      />

      {isDashboard && (
        <div className="dashboard-header py-5">
          <Container>
            <p className="text-white-100 animate-fade-in delay-1">
              Bienvenido al sistema de administración de encuestas y ciclos.
            </p>
          </Container>
        </div>
      )}

      <main className="secretaria-main-content">
        <Container className="py-4 content-wrapper">

          {/* Dashboard solo en /secretaria */}
          {isDashboard && (
            <Row className="mb-5 g-4">
              {metricas.map((metrica, index) => (
                <Col key={index} xl={3} md={6}>
                  <Card className={`metrica-card border-0 shadow-sm h-100 animate-slide-up delay-${index}`}>
                    <Card.Body className="d-flex align-items-center p-4">
                      <div className={`icon-wrapper type-${metrica.type} me-3`}>
                        <i className={`bi ${metrica.icono}`}></i>
                      </div>
                      <div>
                        <h6 className="text-muted text-uppercase mb-1 small fw-bold">
                          {metrica.titulo}
                        </h6>
                        <h3 className="fw-bold mb-0 text-dark">
                          {metrica.valor}
                        </h3>
                        <small className="text-muted description-text">
                          {metrica.descripcion}
                        </small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Aquí se renderizan TODAS las páginas hijas */}
          {!isDashboard && <Outlet />}

        </Container>
      </main>

      <Footer />

    </div>
  );
};
