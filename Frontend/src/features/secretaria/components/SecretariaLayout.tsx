import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../../../components/layout/Navbar/Navbar";
import { Footer } from "../../../components/layout/Footer/Footer";
import '../styles/Secretaria.css';

export const SecretariaLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  }

  const secretariaNavLinks = [
    { to: "/secretaria", label: "Panel Principal" },
    { to: "/secretaria/preguntas", label: "Gestión de Preguntas" },
    { to: "/secretaria/crear-encuesta", label: "Crear Encuesta" },
    { to: "/secretaria/panel-encuestas", label: "Panel Encuesta"},
    { 
      to: "#",
      label: "Cerrar Sesión",
      onClick: handleLogout 
    }
  ];

  const metricas = [
    {
      titulo: 'Encuestas Activas',
      valor: 3,
      icono: 'bi-clipboard-check',
      color: 'primary',
      descripcion: 'Encuestas en curso'
    },
    {
      titulo: 'Preguntas Disponibles',
      valor: 15,
      icono: 'bi-question-circle',
      color: 'success',
      descripcion: 'Preguntas creadas'
    },
    {
      titulo: 'Respuestas Totales',
      valor: 245,
      icono: 'bi-check-circle',
      color: 'info',
      descripcion: 'Encuestas completadas'
    },
    {
      titulo: 'Categorías Activas',
      valor: 7,
      icono: 'bi-collection',
      color: 'warning',
      descripcion: 'Categorías disponibles'
    }
  ];

  return (
    <div className="secretaria-layout">
      <Navbar 
        navLinks={secretariaNavLinks} 
        showUserInfo={false} 
        rol="secretaria"
      />
      <main className="secretaria-main-content">
        <Container fluid className="py-4">
          <Row className="g-4 mb-5">
            {metricas.map((metrica, index) => (
              <Col key={index} xs={12} sm={6} lg={3}>
                <Card className={`border-${metrica.color} h-100 shadow-sm`}>
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col xs={8}>
                        <Card.Title className={`text-${metrica.color} mb-1`}>
                          {metrica.titulo}
                        </Card.Title>
                        <Card.Text className="text-muted small mb-2">
                          {metrica.descripcion}
                        </Card.Text>
                        <h3 className={`text-${metrica.color} mb-0`}>
                          {metrica.valor.toLocaleString()}
                        </h3>
                      </Col>
                      <Col xs={4} className="text-end">
                        <i className={`bi ${metrica.icono} display-4 text-${metrica.color} opacity-75`}></i>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Contenido de las rutas hijas */}
          <div className="secretaria-content">
            <Outlet />
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};