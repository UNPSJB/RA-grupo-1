import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import '../styles/DetalleMateria.css';

interface Materia {
  id: number;
  codigo: string;
  carrera: string;
  cantidadAlumnos: number;
  encuestasContestadas: number;
  porcentajeCompletado: number;
}

export const MisMaterias = () => {
  const navigate = useNavigate();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleVerDetalles = (materiaId: number) => {
    navigate(`/docente/materia/${materiaId}`);
  }; 

  // Simulación de datos 
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        setLoading(true);
        
        // Simulamos una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos de ejemplo - reemplaza con tu API real
        const materiasData: Materia[] = [
          {
            id: 1,
            codigo: "IF001",
            carrera: "Algoritmica y programacion 1",
            cantidadAlumnos: 45,
            encuestasContestadas: 38,
            porcentajeCompletado: 84
          },
          {
            id: 2,
            codigo: "IF007",
            carrera: "Base de Datos 1",
            cantidadAlumnos: 32,
            encuestasContestadas: 25,
            porcentajeCompletado: 78
          },
          {
            id: 3,
            codigo: "IF005",
            carrera: "Arquitectura de Computadoras",
            cantidadAlumnos: 28,
            encuestasContestadas: 15,
            porcentajeCompletado: 54
          },
        ];
        
        setMaterias(materiasData);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar las materias");
        setLoading(false);
      }
    };

    fetchMaterias();
  }, []);

  const getProgressVariant = (porcentaje: number) => {
    if (porcentaje >= 80) return 'success';
    if (porcentaje >= 60) return 'warning';
    return 'danger';
  };

  const getBadgeVariant = (porcentaje: number) => {
    if (porcentaje === 100) return 'success';
    if (porcentaje >= 80) return 'primary';
    if (porcentaje >= 60) return 'warning';
    return 'secondary';
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="loading-text">Cargando mis materias...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="error-alert">
          <Alert.Heading>Error al cargar las materias</Alert.Heading>
          <p className="mb-3">{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mis-materias-container">
      {materias.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="bi bi-journal-x"></i>
          </div>
          <h3>No tienes materias asignadas</h3>
          <p>No se encontraron materias asignadas para este cuatrimestre.</p>
        </div>
      ) : (
        <Row>
          {materias.map((materia) => (
            <Col key={materia.id} xs={12} md={6} lg={4} className="mb-4">
              <Card className="materia-card h-100">
                <Card.Header className="card-header-custom">
                  <div className="d-flex justify-content-between align-items-center">
                    <Badge 
                      bg={getBadgeVariant(materia.porcentajeCompletado)}
                      className="porcentaje-badge"
                    >
                      {materia.porcentajeCompletado}%
                    </Badge>
                    <small className="text-muted">{materia.codigo}</small>
                  </div>
                </Card.Header>
                
                <Card.Body className="card-body-custom">
                  <Card.Title className="materia-title">
                    {materia.nombre}
                  </Card.Title>
                  
                  <Card.Text className="carrera-text">
                    <i className="bi bi-building me-2"></i>
                    {materia.carrera}
                  </Card.Text>
                  
                  <div className="materia-stats">
                    <div className="stat-item">
                      <i className="bi bi-people me-2 text-primary"></i>
                      <strong>Alumnos:</strong>
                      <span className="stat-value">{materia.cantidadAlumnos}</span>
                    </div>
                    
                    <div className="stat-item">
                      <i className="bi bi-check-circle me-2 text-success"></i>
                      <strong>Encuestas contestadas :</strong>
                      <span className="stat-value">{materia.encuestasContestadas}</span>
                    </div>
                    
                    <div className="progress-container">
                      <div className="progress-label">
                        <span>Progreso de encuestas</span>
                        <span>{materia.encuestasContestadas}/{materia.cantidadAlumnos}</span>
                      </div>
                      <div className="progress">
                        <div 
                          className={`progress-bar bg-${getProgressVariant(materia.porcentajeCompletado)}`}
                          style={{ width: `${materia.porcentajeCompletado}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
                
                <Card.Footer className="card-footer-custom">
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleVerDetalles(materia.id)}
                    >
                      <i className="bi bi-eye me-2"></i>
                      Ver Detalles
                    </button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};