import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
      title: 'Departamento',
      description: 'Gestión administrativa del departamento',
      icon: 'bi-building',
      path: '/departamento/gestion',
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
    <Container fluid className="role-selection-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} md={8} lg={6}>
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">
              Sistema de Encuestas
            </h1>
            <p className="lead text-muted">
              Selecciona tu rol para acceder al sistema
            </p>
          </div>
          
          <Row className="g-4">
            {roles.map((role) => (
              <Col key={role.id} xs={12} sm={6}>
                <Card className="role-card h-100 shadow-sm border-0">
                  <Card.Body className="text-center p-4">
                    <div className="role-icon mb-3">
                      <i className={`bi ${role.icon} display-4 text-${role.variant}`}></i>
                    </div>
                    <Card.Title className="h5 fw-bold mb-3">
                      {role.title}
                    </Card.Title>
                    <Card.Text className="text-muted mb-4">
                      {role.description}
                    </Card.Text>
                    <Button
                      variant={role.variant}
                      size="lg"
                      className="w-100"
                      onClick={() => navigate(role.path)}
                    >
                      Acceder como {role.title}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};