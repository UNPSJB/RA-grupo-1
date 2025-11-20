import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Navbar } from "../../../components/layout/Navbar/Navbar";
import { Footer } from "../../../components/layout/Footer/Footer";
import '../styles/Secretaria.css';

export const SecretariaLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => navigate('/');

  const secretariaNavLinks = [
    { to: "/secretaria", label: "Panel Principal" },
    { to: "/secretaria/crear-encuesta", label: "Crear Encuesta" },
    { to: "/secretaria/panel-encuestas", label: "Panel Encuestas"},
    { to: "/secretaria/ciclos", label: "Ciclos" }, 
    { to: "#", label: "Cerrar Sesión", onClick: handleLogout }
  ];

  const metricas = [
    { titulo: 'Encuestas Activas', valor: 3, icono: 'bi-clipboard-check', color: 'primary', descripcion: 'Encuestas en curso' },
    { titulo: 'Preguntas Disponibles', valor: 15, icono: 'bi-question-circle', color: 'success', descripcion: 'Preguntas creadas' },
    { titulo: 'Respuestas Totales', valor: 245, icono: 'bi-check-circle', color: 'info', descripcion: 'Encuestas completadas' },
    { titulo: 'Categorías Activas', valor: 7, icono: 'bi-collection', color: 'warning', descripcion: 'Categorías disponibles' }
  ];

  const mostrarMetricas = location.pathname === "/secretaria"; 

  return (
    <div className="secretaria-layout">
      <Navbar 
        navLinks={secretariaNavLinks} 
        showUserInfo={false} 
        rol="secretaria"
      />

      <main className="secretaria-main-content">
        {mostrarMetricas && (
          <Container fluid className="py-4">
            <Row className="mb-4">
              {metricas.map((metrica, index) => (
                <Col key={index} xl={3} md={6} className="mb-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="card-title text-muted text-uppercase small">
                            {metrica.titulo}
                          </h6>
                          <h2 className={`fw-bold text-${metrica.color} mb-1`}>
                            {metrica.valor.toLocaleString()}
                          </h2>
                          <small className="text-muted">{metrica.descripcion}</small>
                        </div>
                        <div className={`bg-${metrica.color} bg-opacity-10 p-3 rounded`}>
                          <i className={`bi ${metrica.icono} text-${metrica.color} fs-4`}></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        )}
      </main>

      <div className="secretaria-content">
        <Outlet /> 
      </div>
      
      <Footer />
    </div>
  );
};
