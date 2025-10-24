import { Outlet } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../../../components/layout/Navbar/Navbar";
import { Footer } from "../../../components/layout/Footer/Footer";
import '../styles/Secretaria.css';

export const SecretariaLayout = () => {
  const navigate = useNavigate();

  const secretariaNavLinks = [
    { to: "/secretaria", label: "Panel Principal" },
    { to: "/secretaria/preguntas", label: "Gestión de Preguntas" },
    { to: "/secretaria/crear-encuesta", label: "Crear Encuesta" }
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

  const accionesRapidas = [
    {
      icono: 'bi-plus-circle',
      titulo: 'Crear Encuesta',
      descripcion: 'Configurar nueva encuesta',
      accion: () => navigate('/secretaria/crear-encuesta'),
      color: 'primary'
    },
    {
      icono: 'bi-question-circle',
      titulo: 'Gestionar Preguntas',
      descripcion: 'Administrar preguntas disponibles',
      accion: () => navigate('/secretaria/preguntas'),
      color: 'success'
    },
    {
      icono: 'bi-graph-up',
      titulo: 'Ver Estadísticas',
      descripcion: 'Reportes y análisis',
      accion: () => navigate('/secretaria'),
      color: 'info'
    },
    {
      icono: 'bi-gear',
      titulo: 'Configuración',
      descripcion: 'Ajustes del sistema',
      accion: () => console.log('Configuración'),
      color: 'secondary'
    }
  ];

  return (
    <div className="secretaria-layout">
      <Navbar 
        navLinks={secretariaNavLinks} 
        showUserInfo={true} 
        rol="secretaria"
      />
      
      <main className="secretaria-main-content">
        <Container fluid className="py-4">
          <Row className="mb-4">
            <Col>
              <h1 className="h2">Panel de Control - Secretaría Académica</h1>
              <p className="text-muted">Sistema de Gestión de Encuestas Universitarias</p>
            </Col>
          </Row>

          {/* Métricas del sistema */}
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

          {/* Acciones rápidas */}
          <Row className="mb-5">
            <Col>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Acciones Rápidas</h5>
                  <small className="text-muted">Accede rápidamente a las funciones principales</small>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {accionesRapidas.map((accion, index) => (
                      <Col key={index} md={3} className="text-center mb-3">
                        <Button
                          variant="outline-primary"
                          className="p-4 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                          onClick={accion.accion}
                          style={{ minHeight: '140px', border: '2px solid #dee2e6' }}
                        >
                          <i className={`bi ${accion.icono} display-5 text-${accion.color} mb-3`}></i>
                          <h6 className="mb-2">{accion.titulo}</h6>
                          <small className="text-muted">{accion.descripcion}</small>
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
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