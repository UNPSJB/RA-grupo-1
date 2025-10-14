import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../../../components/layout/Navbar/Navbar";
import { Footer } from "../../../components/layout/Footer/Footer";
import '../styles/RoleSelection.css';

export const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'alumno',
      title: 'Alumno',
      description: 'Accede para completar tus encuestas',
      icon: 'bi-person',
      path: '/alumno/incompletas',
      variant: 'primary'
    },
    {
      id: 'docente',
      title: 'Docente',
      description: 'Accede a reportes y gestión de encuestas',
      icon: 'bi-person-badge',
      path: '/docente',
      variant: 'success'
    },
    {
      id: 'departamento',
      title: 'Departamento de Alumnos',
      description: 'Gestión administrativa del departamento',
      icon: 'bi-building-gear',
      path: '/departamento/gestion-preguntas',
      variant: 'warning'
    },
    {
      id: 'secretaria',
      title: 'Secretaría',
      description: 'Administración del sistema',
      icon: 'bi-gear',
      path: '/secretaria/admin',
      variant: 'info'
    }
  ];

  return (
    <div className="role-selection-page">
      {/* Navbar sin info de usuario */}
      <Navbar navLinks={[]} showUserInfo={false} />
      
      <Container fluid className="role-selection-container py-5">
        <Row className="justify-content-center">
          <Col xs={12} className="text-center mb-5">
          
          </Col>
        </Row>

        <Row className="justify-content-center g-4">
          {roles.map((role) => (
            <Col key={role.id} xs={12} sm={6} md={3}>
              <Card className="role-card h-100 shadow-sm border-0 text-center">
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="role-icon mb-3">
                    <i className={`bi ${role.icon} display-4 text-${role.variant}`}></i>
                  </div>
                  <Card.Title className="h5 fw-bold mb-3">
                    {role.title}
                  </Card.Title>
                  <Card.Text className="text-muted mb-4 flex-grow-1">
                    {role.description}
                  </Card.Text>
                  <Button
                    variant={role.variant}
                    size="lg"
                    className="w-100 mt-auto"
                    onClick={() => navigate(role.path)}
                  >
                    Acceder como {role.title}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Footer />
    </div>
  );
};