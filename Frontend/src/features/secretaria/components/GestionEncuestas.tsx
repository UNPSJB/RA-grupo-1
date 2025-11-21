import { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, 
  Form, Modal, Spinner, Alert, Badge 
} from 'react-bootstrap';


interface Encuesta {
  id: number;
  nombre: string;
  descripcion: string;
  estado: 'activa' | 'inactiva' | 'programada';
  fechaInicio: string;
  fechaFin: string;
  asignaturasAsignadas: number;
  respuestasRecibidas: number;
}

export const GestionEncuestas = () => {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEncuestas = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
    
        const encuestasData: Encuesta[] = [
          {
            id: 1,
            nombre: "Algebra",
            descripcion: "Evaluación docente del primer cuatrimestre",
            estado: 'activa',
            fechaInicio: '2025-04-05',
            fechaFin: '2025-07-30',
            asignaturasAsignadas: 45,
            respuestasRecibidas: 1250
          },
        ];
        
        setEncuestas(encuestasData);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar las encuestas");
        setLoading(false);
      }
    };

    fetchEncuestas();
  }, []);

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'activa': return 'success';
      case 'inactiva': return 'secondary';
      case 'programada': return 'warning';
      default: return 'secondary';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'activa': return 'Activa';
      case 'inactiva': return 'Inactiva';
      case 'programada': return 'Programada';
      default: return estado;
    }
  };

  const activarEncuesta = (id: number) => {
    setEncuestas(prev => prev.map(e => 
      e.id === id ? { ...e, estado: 'activa' } : e
    ));
  };

  const desactivarEncuesta = (id: number) => {
    setEncuestas(prev => prev.map(e => 
      e.id === id ? { ...e, estado: 'inactiva' } : e
    ));
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="loading-text">Cargando encuestas...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="error-alert">
          <Alert.Heading>Error al cargar las encuestas</Alert.Heading>
          <p className="mb-3">{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="departamento-container">
      <Row>
        {encuestas.map((encuesta) => (
          <Col key={encuesta.id} xs={12} lg={6} className="mb-4">
            <Card className="encuesta-card h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Badge bg={getEstadoBadgeVariant(encuesta.estado)}>
                  {getEstadoText(encuesta.estado)}
                </Badge>
                <div className="encuesta-actions">
                  {encuesta.estado === 'activa' && (
                    <Button variant="outline-warning" size="sm" onClick={() => desactivarEncuesta(encuesta.id)}>
                      <i className="bi bi-pause"></i>
                    </Button>
                  )}
                  {encuesta.estado === 'inactiva' && (
                    <Button variant="outline-success" size="sm" onClick={() => activarEncuesta(encuesta.id)}>
                      <i className="bi bi-play"></i>
                    </Button>
                  )}
                  <Button variant="outline-primary" size="sm" className="ms-1">
                    <i className="bi bi-pencil"></i>
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Card.Title>{encuesta.nombre}</Card.Title>
                <Card.Text className="text-muted">
                  {encuesta.descripcion}
                </Card.Text>
                
                <div className="encuesta-info">
                  <div className="info-item">
                    <i className="bi bi-calendar-event me-2"></i>
                    <strong>Inicio:</strong> {formatearFecha(encuesta.fechaInicio)}
                  </div>
                  <div className="info-item">
                    <i className="bi bi-calendar-check me-2"></i>
                    <strong>Fin:</strong> {formatearFecha(encuesta.fechaFin)}
                  </div>
                  <div className="info-item">
                    <i className="bi bi-journals me-2"></i>
                    <strong>Asignaturas:</strong> {encuesta.asignaturasAsignadas}
                  </div>
                  <div className="info-item">
                    <i className="bi bi-check-circle me-2"></i>
                    <strong>Respuestas:</strong> {encuesta.respuestasRecibidas}
                  </div>
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" size="sm">
                    <i className="bi bi-eye me-2"></i>
                    Ver Detalles
                  </Button>
                  <Button variant="outline-info" size="sm">
                    <i className="bi bi-graph-up me-2"></i>
                    Ver Reportes
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Encuesta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Formulario para crear nueva encuesta.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary">
            Crear Encuesta
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};