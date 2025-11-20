import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../../../components/layout/Navbar/Navbar";
import { Footer } from "../../../components/layout/Footer/Footer";
import '../styles/RoleSelection.css';

export const RoleSelection = () => {
  const navigate = useNavigate();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');

  const roles = [
    {
      id: 'alumno',
      title: 'Alumno',
      description: 'Accede para completar tus encuestas y ver historial.',
      icon: 'bi-person-fill',
      path: '/alumno/login',
      variant: 'primary'
    },
    {
      id: 'docente',
      title: 'Docente',
      description: 'Accede a reportes y gestión académica.',
      icon: 'bi-person-workspace',
      path: '/docente',
      variant: 'success'
    },
    {
      id: 'departamento',
      title: 'Dpto. Alumnos',
      description: 'Gestión administrativa del departamento.',
      icon: 'bi-building-fill-gear',
      path: '/departamento',
      variant: 'warning'
    },
    {
      id: 'secretaria',
      title: 'Secretaría',
      description: 'Administración general del sistema.',
      icon: 'bi-gear-wide-connected',
      path: '/secretaria',
      variant: 'info'
    }
  ];

  const handleNext = () => {
    setSlideDirection('right'); 
    setCurrentIndex((prevIndex) => (prevIndex + 1) % roles.length);
  };

  const handlePrev = () => {
    setSlideDirection('left'); 
    setCurrentIndex((prevIndex) => (prevIndex - 1 + roles.length) % roles.length);
  };

  const currentRole = roles[currentIndex];

  return (
    <div className="role-selection-page">
      <Navbar navLinks={[]} showUserInfo={false} />
      
      <Container fluid className="role-selection-container d-flex align-items-center justify-content-center">
        <Row className="w-100 justify-content-center align-items-center">
          
          {/* Flecha Izquierda */}
          <Col xs={2} md={1} className="text-end d-none d-md-block">
            <Button variant="link" className="nav-arrow text-white" onClick={handlePrev}>
                <i className="bi bi-chevron-compact-left display-4"></i>
            </Button>
          </Col>

          {/* Tarjeta Central */}
          <Col xs={12} md={6} lg={4}>
            <Card className="role-card shadow-lg border-0 text-center p-3 overflow-hidden">
              <Card.Body className="d-flex flex-column align-items-center">
                
                {/* IMPORTANTE: Envolvemos el contenido cambiante en un div.
                   key={currentRole.id}: Fuerza a React a recrear este div al cambiar de rol.
                   className={`... animate-${slideDirection}`}: Aplica la clase CSS correcta.
                */}
                <div 
                  key={currentRole.id} 
                  className={`role-content-wrapper w-100 d-flex flex-column align-items-center animate-${slideDirection}`}
                >
                    <div className={`icon-circle mb-4 bg-${currentRole.variant} bg-opacity-10`}>
                      <i className={`bi ${currentRole.icon} display-1 text-${currentRole.variant}`}></i>
                    </div>

                    <Card.Title className="h2 fw-bold mb-3 text-dark">
                      {currentRole.title}
                    </Card.Title>
                    
                    <Card.Text className="text-muted mb-5 fs-5">
                      {currentRole.description}
                    </Card.Text>

                    <Button
                      style={{ backgroundColor: 'var(--uni-blue)', border: 'none' }}
                      size="lg"
                      className="w-100 rounded-pill py-3 fw-bold shadow-sm btn-ingresar"
                      onClick={() => navigate(currentRole.path)}
                    >
                      Ingresar
                    </Button>
                </div>

                {/* Indicadores */}
                <div className="d-flex gap-2 mt-4">
                    {roles.map((_, idx) => (
                        <span 
                            key={idx} 
                            className={`indicator ${idx === currentIndex ? 'active' : ''}`}
                            onClick={() => {
                                setSlideDirection(idx > currentIndex ? 'right' : 'left');
                                setCurrentIndex(idx);
                            }}
                        ></span>
                    ))}
                </div>
              </Card.Body>
            </Card>
            
            {/* Controles Móviles */}
            <div className="d-flex justify-content-between mt-3 d-md-none">
                <Button variant="outline-light" onClick={handlePrev}>Anterior</Button>
                <Button variant="light" onClick={handleNext}>Siguiente</Button>
            </div>
          </Col>

          {/* Flecha Derecha */}
          <Col xs={2} md={1} className="text-start d-none d-md-block">
            <Button variant="link" className="nav-arrow text-white" onClick={handleNext}>
                <i className="bi bi-chevron-compact-right display-4"></i>
            </Button>
          </Col>

        </Row>
      </Container>

      <Footer />
    </div>
  );
};