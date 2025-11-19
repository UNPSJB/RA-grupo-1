import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Spinner, Alert, Badge, 
  Form, InputGroup, Button 
} from 'react-bootstrap';
import '../styles/AsignaturasCursadas.css';

interface AsignaturaCursada {
  id: number;
  nombre: string;
  codigo: string;
  carrera: string;
  cantidadAlumnos: number;
  encuestasContestadas: number;
  porcentajeCompletado: number;
  fechaInicio: string;
  fechaFin: string;
  estadoEncuesta: 'completada' | 'en-progreso' | 'no-iniciada';
}

export const AsignaturasCursadas = () => {
  const navigate = useNavigate();
  const [asignaturasCursadas, setAsignaturasCursadas] = useState<AsignaturaCursada[]>([]);
  const [asignaturasCursadasFiltradas, setAsignaturasCursadasFiltradas] = useState<AsignaturaCursada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los filtros
  const [filtroAsignaturaCursada, setFiltroAsignaturaCursada] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');

  const handleVerDetalles = (asignaturaId: number) => {
    navigate(`/alumno/asignatura/${asignaturaId}`);
  };

  // DATOS HARCODEADOS
  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        setLoading(true);
        
        // Simulamos llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // DATOS HARCODEADOS
        const AsignaturaData: AsignaturaCursada[] = [
          {
            id: 1,
            nombre: "Programación I",
            codigo: "IF003",
            carrera: "Ingeniería en Sistemas",
            cantidadAlumnos: 45,
            encuestasContestadas: 38,
            porcentajeCompletado: 84,
            fechaInicio: "2024-03-01",
            fechaFin: "2024-07-15",
            estadoEncuesta: 'completada'
          },
          {
            id: 2,
            nombre: "Base de Datos 1",
            codigo: "IF007",
            carrera: "Ingeniería en Sistemas",
            cantidadAlumnos: 32,
            encuestasContestadas: 25,
            porcentajeCompletado: 78,
            fechaInicio: "2024-03-01",
            fechaFin: "2024-07-20",
            estadoEncuesta: 'en-progreso'
          },
          {
            id: 3,
            nombre: "Arquitectura de Computadoras",
            codigo: "IF005",
            carrera: "Ingeniería en Sistemas",
            cantidadAlumnos: 28,
            encuestasContestadas: 15,
            porcentajeCompletado: 54,
            fechaInicio: "2024-03-15",
            fechaFin: "2024-07-30",
            estadoEncuesta: 'en-progreso'
          },
        ];
        
        setAsignaturasCursadas(asignaturaData);
        setAsignaturasCursadasFiltradas(asignaturaData);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar las asignaturas");
        setLoading(false);
      }
    };

    fetchAsignaturas();
  }, []);

  // Función para aplicar filtros
  const aplicarFiltros = () => {
    let resultados = [...asignaturasCursadas];

    if (filtroAsignaturaCursada) {
      resultados = resultados.filter(asignatura =>
        asignatura.nombre.toLowerCase().includes(filtroAsignaturaCursada.toLowerCase()) ||
        asignatura.codigo.toLowerCase().includes(filtroAsignaturaCursada.toLowerCase())
      );
    }

    // Filtro por estado de encuesta
    if (filtroEstado !== 'todos') {
      resultados = resultados.filter(asignatura => asignatura.estadoEncuesta === filtroEstado);
    }

    // Filtro por rango de fechas
    if (filtroFechaInicio) {
      resultados = resultados.filter(asignatura => asignatura.fechaInicio >= filtroFechaInicio);
    }

    if (filtroFechaFin) {
      resultados = resultados.filter(asignatura => asignatura.fechaFin <= filtroFechaFin);
    }

    setAsignaturasCursadasFiltradas(resultados);
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltroAsignaturaCursada('');
    setFiltroEstado('todos');
    setFiltroFechaInicio('');
    setFiltroFechaFin('');
    setAsignaturasCursadasFiltradas(asignaturasCursadas);
  };

  // Aplicar filtros cuando cambien los valores
  useEffect(() => {
    aplicarFiltros();
  }, [filtroAsignaturaCursada, filtroEstado, filtroFechaInicio, filtroFechaFin, asignaturasCursadas]);

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

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'completada': return 'success';
      case 'en-progreso': return 'warning';
      case 'no-iniciada': return 'secondary';
      default: return 'secondary';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'completada': return 'Completada';
      case 'en-progreso': return 'En Progreso';
      case 'no-iniciada': return 'No Iniciada';
      default: return estado;
    }
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
          <p className="loading-text">Cargando mis asignaturas...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="error-alert">
          <Alert.Heading>Error al cargar las asignaturas</Alert.Heading>
          <p className="mb-3">{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mis-asignaturas-container">
      {/* Sección de Filtros */}
      <Card className="filters-card mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <i className="bi bi-funnel me-2"></i>
            Filtros de Búsqueda
          </h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Buscar por asignatura</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Nombre o código de la asignatura..."
                    value={filtroAsignaturaCursada}
                    onChange={(e) => setFiltroAsignaturaCursada(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Filtro por Estado */}
            <Col md={3}>
              <Form.Group>
                <Form.Label>Estado de encuesta</Form.Label>
                <Form.Select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="completada">Completada</option>
                  <option value="en-progreso">En Progreso</option>
                  <option value="no-iniciada">No Iniciada</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Filtro por Fecha Inicio */}
            <Col md={2}>
              <Form.Group>
                <Form.Label>Fecha desde</Form.Label>
                <Form.Control
                  type="date"
                  value={filtroFechaInicio}
                  onChange={(e) => setFiltroFechaInicio(e.target.value)}
                />
              </Form.Group>
            </Col>

            {/* Filtro por Fecha Fin */}
            <Col md={2}>
              <Form.Group>
                <Form.Label>Fecha hasta</Form.Label>
                <Form.Control
                  type="date"
                  value={filtroFechaFin}
                  onChange={(e) => setFiltroFechaFin(e.target.value)}
                />
              </Form.Group>
            </Col>

            {/* Botón Limpiar */}
            <Col md={1} className="d-flex align-items-end">
              <Button 
                variant="outline-secondary" 
                onClick={limpiarFiltros}
                className="w-100"
                title="Limpiar filtros"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Contador de resultados */}
      <div className="results-info mb-3">
        <p className="text-muted">
          Mostrando {asignaturasCursadasFiltradas.length} de {asignaturasCursadas.length} asignaturas
        </p>
      </div>

      {asignaturasCursadasFiltradas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="bi bi-search"></i>
          </div>
          <h3>No se encontraron asignaturas</h3>
          <p>No hay asignaturas que coincidan con los filtros aplicados.</p>
          <Button variant="primary" onClick={limpiarFiltros}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <Row>
          {asignaturasCursadasFiltradas.map((asignatura) => (
            <Col key={asignatura.id} xs={12} md={6} lg={4} className="mb-4">
              <Card className="asignatura-card h-100">
                <Card.Header className="card-header-custom">
                  <div className="d-flex justify-content-between align-items-center">
                    <Badge 
                      bg={getBadgeVariant(asignatura.porcentajeCompletado)}
                      className="porcentaje-badge"
                    >
                      {asignatura.porcentajeCompletado}%
                    </Badge>
                    <Badge 
                      bg={getEstadoBadgeVariant(asignatura.estadoEncuesta)}
                      className="estado-badge"
                    >
                      {getEstadoText(asignatura.estadoEncuesta)}
                    </Badge>
                  </div>
                </Card.Header>
                
                <Card.Body className="card-body-custom">
                  <Card.Title className="asignatura-title">
                    {asignatura.nombre}
                  </Card.Title>
                  
                  <Card.Text className="carrera-text">
                    <i className="bi bi-building me-2"></i>
                    {asignatura.carrera}
                    <br />
                    <small className="text-muted">
                      <i className="bi bi-code me-1"></i>
                      {asignatura.codigo}
                    </small>
                  </Card.Text>

                  {/* Fechas */}
                  <div className="fechas-info">
                    <small className="text-muted">
                      <i className="bi bi-calendar me-1"></i>
                      {formatearFecha(asignatura.fechaInicio)} - {formatearFecha(asignatura.fechaFin)}
                    </small>
                  </div>
                  
                  <div className="asignatura-stats">
                    <div className="stat-item">
                      <i className="bi bi-people me-2 text-primary"></i>
                      <strong>Alumnos:</strong>
                      <span className="stat-value">{asignatura.cantidadAlumnos}</span>
                    </div>
                    
                    <div className="stat-item">
                      <i className="bi bi-check-circle me-2 text-success"></i>
                      <strong>Encuestas contestadas:</strong>
                      <span className="stat-value">{asignatura.encuestasContestadas}</span>
                    </div>
                    
                    <div className="progress-container">
                      <div className="progress-label">
                        <span>Progreso de encuestas</span>
                        <span>{asignatura.encuestasContestadas}/{asignatura.cantidadAlumnos}</span>
                      </div>
                      <div className="progress">
                        <div 
                          className={`progress-bar bg-${getProgressVariant(asignatura.porcentajeCompletado)}`}
                          style={{ width: `${asignatura.porcentajeCompletado}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
                
                <Card.Footer className="card-footer-custom">
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleVerDetalles(asignatura.id)}
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