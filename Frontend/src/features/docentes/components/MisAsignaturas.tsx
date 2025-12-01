import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Spinner, Alert, 
  Form, InputGroup, Button 
} from 'react-bootstrap';
import '../styles/MisAsignaturas.css';

interface Asignatura {
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

export const MisAsignaturas = () => {
  const navigate = useNavigate();
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [asignaturasFiltradas, setAsignaturasFiltradas] = useState<Asignatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtroAsignatura, setFiltroAsignatura] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');

  const handleVerDetalles = (asignaturaId: number) => {
    navigate(`/docente/asignatura/${asignaturaId}`);
  };

  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const AsignaturasData: Asignatura[] = [
          
        ];
        
        setAsignaturas(AsignaturasData);
        setAsignaturasFiltradas(AsignaturasData);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar las asignaturas");
        setLoading(false);
      }
    };
    fetchAsignaturas();
  }, []);

  const aplicarFiltros = () => {
    let resultados = [...asignaturas];
    if (filtroAsignatura) {
      resultados = resultados.filter(asignatura =>
        asignatura.nombre.toLowerCase().includes(filtroAsignatura.toLowerCase()) ||
        asignatura.codigo.toLowerCase().includes(filtroAsignatura.toLowerCase())
      );
    }
    if (filtroEstado !== 'todos') {
      resultados = resultados.filter(asignatura => asignatura.estadoEncuesta === filtroEstado);
    }
    if (filtroFechaInicio) resultados = resultados.filter(a => a.fechaInicio >= filtroFechaInicio);
    if (filtroFechaFin) resultados = resultados.filter(a => a.fechaFin <= filtroFechaFin);
    
    setAsignaturasFiltradas(resultados);
  };

  const limpiarFiltros = () => {
    setFiltroAsignatura('');
    setFiltroEstado('todos');
    setFiltroFechaInicio('');
    setFiltroFechaFin('');
    setAsignaturasFiltradas(asignaturas);
  };

  useEffect(() => { aplicarFiltros(); }, [filtroAsignatura, filtroEstado, filtroFechaInicio, filtroFechaFin, asignaturas]);

  const getProgressVariant = (porcentaje: number) => {
    if (porcentaje >= 80) return 'success';
    if (porcentaje >= 40) return 'primary'; // Azul institucional
    return 'warning';
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'completada': return 'Finalizada';
      case 'en-progreso': return 'En Curso';
      case 'no-iniciada': return 'Sin Iniciar';
      default: return estado;
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit'});
  };

  if (loading) return <Container className="text-center py-5"><Spinner animation="border" variant="primary"/></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mis-asignaturas-container animate-fade-in">
      
      {/* --- SECCIÓN DE FILTROS REDISEÑADA --- */}
      <Card className="filters-card-blue shadow-lg">
        <Card.Body className="p-4">
          <Row className="justify-content-center align-items-end g-3">
            
            {/* Buscador Principal */}
            <Col md={4}>
              <Form.Label className="filter-label text-white">BUSCAR ASIGNATURA</Form.Label>
              <InputGroup className="filter-input-group">
                <InputGroup.Text className="bg-white border-0">
                  <img 
                    src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHZpMm1oc25yMW15MmI0bnJzNXE4d3B1aHhrejI1MXlrNmVoNnA0biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/1pUvx2WHilZYxZ60e1/giphy.gif"
                    alt="buscar" style={{ width: "20px" }}
                  />
                </InputGroup.Text>
                <Form.Control
                  className="border-0 shadow-none"
                  type="text"
                  placeholder="Nombre o código..."
                  value={filtroAsignatura}
                  onChange={(e) => setFiltroAsignatura(e.target.value)}
                />
              </InputGroup>
            </Col>

            {/* Estado */}
            <Col md={3}>
              <Form.Label className="filter-label text-white">ESTADO</Form.Label>
              <Form.Select
                className="filter-select border-0"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="completada">Finalizada</option>
                <option value="en-progreso">En Curso</option>
                <option value="no-iniciada">Sin Iniciar</option>
              </Form.Select>
            </Col>

            {/* Fechas y Botón Limpiar */}
            <Col md={4}>
              <Form.Label className="filter-label text-white">FECHAS</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control type="date" className="border-0" value={filtroFechaInicio} onChange={(e) => setFiltroFechaInicio(e.target.value)}/>
                <Form.Control type="date" className="border-0" value={filtroFechaFin} onChange={(e) => setFiltroFechaFin(e.target.value)}/>
                <Button variant="light" onClick={limpiarFiltros} title="Limpiar"><i className="bi bi-arrow-counterclockwise text-primary"></i></Button>
              </div>
            </Col>

          </Row>
        </Card.Body>
      </Card>

      <Row className="g-3">
        {asignaturasFiltradas.map((asignatura) => (
          /* COL-12 para que ocupe todo el ancho y sea alargada */
          <Col key={asignatura.id} xs={12}>
            <Card className="asignatura-card-horizontal">
              {/* Barra lateral de color según estado */}
              <div className={`status-indicator ${asignatura.estadoEncuesta}`}></div>
              
              <Card.Body className="d-flex flex-column flex-md-row align-items-center justify-content-between p-3 w-100 gap-3">
                
                {/* SECCIÓN IZQUIERDA: INFORMACIÓN PRINCIPAL */}
                <div className="info-section flex-grow-1 text-center text-md-start">
                  <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
                    <span className="codigo-badge-compact">{asignatura.codigo}</span>
                    <h5 className="mb-0 fw-bold text-dark text-truncate" style={{maxWidth: '350px'}} title={asignatura.nombre}>
                      {asignatura.nombre}
                    </h5>
                  </div>
                  <div className="text-muted small mb-1">
                    <i className="bi bi-mortarboard-fill me-1"></i> {asignatura.carrera}
                  </div>
                  <div className="text-primary small fw-bold">
                    <i className="bi bi-calendar-range me-1"></i> 
                    {formatearFecha(asignatura.fechaInicio)} - {formatearFecha(asignatura.fechaFin)}
                  </div>
                </div>

                {/* SECCIÓN CENTRAL: ESTADÍSTICAS COMPACTAS */}
                <div className="stats-section d-flex gap-4 border-start border-end px-4 py-1 d-none d-md-flex">
                  <div className="text-center">
                    <div className="h5 mb-0 fw-bold">{asignatura.cantidadAlumnos}</div>
                    <div className="small text-muted" style={{fontSize: '0.65rem'}}>ALUMNOS</div>
                  </div>
                  <div className="text-center">
                    <div className="h5 mb-0 fw-bold text-primary">{asignatura.encuestasContestadas}</div>
                    <div className="small text-muted" style={{fontSize: '0.65rem'}}>RESPUESTAS</div>
                  </div>
                </div>

                {/* SECCIÓN DERECHA: PROGRESO Y ACCIÓN */}
                <div className="action-section d-flex flex-column align-items-end gap-2" style={{minWidth: '200px'}}>
                  {/* Estado visible en texto */}
                  <span className={`badge-pill-status ${asignatura.estadoEncuesta} ms-auto`}>
                    {getEstadoText(asignatura.estadoEncuesta)}
                  </span>
                  
                  {/* Barra de progreso */}
                  <div className="w-100 d-flex align-items-center gap-2">
                    <div className="progress flex-grow-1" style={{height: '6px', backgroundColor: '#e9ecef'}}>
                      <div className={`progress-bar bg-${getProgressVariant(asignatura.porcentajeCompletado)}`} 
                           style={{ width: `${asignatura.porcentajeCompletado}%` }}></div>
                    </div>
                    <span className="small fw-bold">{asignatura.porcentajeCompletado}%</span>
                  </div>

                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="w-100 fw-bold rounded-pill mt-1"
                    onClick={() => handleVerDetalles(asignatura.id)}
                  >
                    Ver Detalles
                  </Button>
                </div>

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      {asignaturasFiltradas.length === 0 && (
         <div className="text-center py-5 text-muted">No se encontraron asignaturas.</div>
      )}
    </Container>
  );
};