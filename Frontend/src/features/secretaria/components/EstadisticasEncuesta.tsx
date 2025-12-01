import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Table, Button, Badge } from 'react-bootstrap';
import { useSecretaria } from '../hooks/useSecretaria';
import '../styles/Estadisticas.css'; 

export const EstadisticasEncuesta = () => {
  const { encuestaId } = useParams<{ encuestaId: string }>();
  const navigate = useNavigate();
  const { estadisticas, loading, error, cargarEstadisticas, encuestas } = useSecretaria();

  const encuesta = encuestas.find(e => e.id === parseInt(encuestaId || '0'));

  useEffect(() => {
    if (encuestaId) {
      cargarEstadisticas(parseInt(encuestaId));
    }
  }, [encuestaId]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Analizando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="shadow-sm border-0">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
        </Alert>
      </Container>
    );
  }

  if (!estadisticas || !encuesta) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="shadow-sm border-0">
          No se encontraron estadísticas para esta encuesta.
        </Alert>
      </Container>
    );
  }

  // Helpers para iconos y colores
  const getMetricConfig = (type: string) => {
    switch(type) {
      case 'responses': return { icon: 'bi-people-fill', color: 'var(--uni-accent)', bg: 'rgba(255, 196, 37, 0.1)' };
      case 'questions': return { icon: 'bi-list-task', color: 'var(--uni-primary)', bg: 'rgba(53, 132, 194, 0.1)' };
      case 'start': return { icon: 'bi-calendar-event', color: '#20c997', bg: 'rgba(32, 201, 151, 0.1)' };
      case 'end': return { icon: 'bi-calendar-check', color: '#e83e8c', bg: 'rgba(232, 62, 140, 0.1)' };
      default: return { icon: 'bi-circle', color: 'gray', bg: '#eee' };
    }
  };

  return (
    <Container fluid className="py-4 animate-fade-in">
      {/* Header Section */}
      <div className="stats-header mb-5">
        <Button 
          variant="link" 
          onClick={() => navigate(-1)} 
          className="text-decoration-none text-muted ps-0 mb-2 back-btn"
        >
          <i className="bi bi-arrow-left me-2"></i>Volver al panel
        </Button>
        
        <Row className="align-items-end">
          <Col lg={8}>
            <Badge bg="light" text="dark" className="mb-2 border">Estadísticas</Badge>
            <h1 className="display-6 fw-bold text-dark mb-2">{encuesta.titulo}</h1>
            <p className="text-muted mb-0 lead fs-6">{encuesta.descripcion}</p>
          </Col>
          <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
             <div className="total-badge p-3 rounded-4 d-inline-flex align-items-center shadow-sm">
                <div className="icon-circle me-3 bg-white text-primary">
                  <i className="bi bi-bar-chart-fill"></i>
                </div>
                <div className="text-start">
                  <h2 className="mb-0 fw-bold text-primary">{estadisticas.totalRespuestas}</h2>
                  <small className="text-muted text-uppercase fw-bold" style={{fontSize: '0.7rem'}}>Respuestas Totales</small>
                </div>
             </div>
          </Col>
        </Row>
      </div>

      {/* Resumen Cards */}
      <Row className="g-4 mb-5">
        {[
          { title: 'Completadas', value: estadisticas.totalRespuestas, type: 'responses' },
          { title: 'Preguntas', value: estadisticas.preguntas.length, type: 'questions' },
          { title: 'Inicio', value: new Date(encuesta.fechaInicio).toLocaleDateString(), type: 'start' },
          { title: 'Finalización', value: new Date(encuesta.fechaFin).toLocaleDateString(), type: 'end' }
        ].map((stat, idx) => {
          const config = getMetricConfig(stat.type);
          return (
            <Col md={3} sm={6} key={idx}>
              <div className="stat-mini-card h-100 p-4 rounded-4 bg-white shadow-sm d-flex align-items-center animate-slide-up" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="icon-box rounded-3 me-3 d-flex align-items-center justify-content-center" 
                     style={{ backgroundColor: config.bg, color: config.color, width: '48px', height: '48px', fontSize: '1.5rem' }}>
                  <i className={`bi ${config.icon}`}></i>
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">{stat.value}</h5>
                  <small className="text-muted">{stat.title}</small>
                </div>
              </div>
            </Col>
          )
        })}
      </Row>

      {/* Lista de Preguntas */}
      <div className="questions-container">
        {estadisticas.preguntas.map((preguntaStats, index) => (
          <Card key={preguntaStats.preguntaId} className="question-card border-0 shadow-sm mb-4 rounded-4 animate-slide-up" style={{animationDelay: `${0.3 + (index * 0.1)}s`}}>
            <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Badge bg={preguntaStats.tipo === 'abierta' ? 'info' : 'primary'} className="mb-2">
                    {preguntaStats.tipo === 'abierta' ? 'Texto Libre' : 'Selección Múltiple'}
                  </Badge>
                  <h5 className="fw-bold mb-1 text-dark">
                    <span className="text-muted me-2">#{index + 1}</span> 
                    {preguntaStats.textoPregunta}
                  </h5>
                </div>
                <Badge bg="light" text="dark" className="border">
                  {preguntaStats.respuestas.length} respuestas
                </Badge>
              </div>
            </Card.Header>
            
            <Card.Body className="p-4">
              {preguntaStats.tipo === 'cerrada' && preguntaStats.estadisticas ? (
                <Row className="g-4">
                  <Col lg={12}>
                    <div className="table-responsive rounded-3 border">
                      <Table className="mb-0 custom-table align-middle" hover borderless>
                        <thead className="bg-light">
                          <tr>
                            <th className="ps-4 py-3 text-uppercase text-muted small">Opción</th>
                            <th className="text-center text-uppercase text-muted small" style={{width: '100px'}}>Total</th>
                            <th className="pe-4 text-uppercase text-muted small" style={{width: '40%'}}>Distribución</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(preguntaStats.estadisticas).map(([opcion, cantidad], i) => {
                            const porcentaje = (cantidad / preguntaStats.respuestas.length) * 100;
                            return (
                              <tr key={opcion}>
                                <td className="ps-4 fw-medium">{opcion}</td>
                                <td className="text-center fw-bold text-primary">{cantidad}</td>
                                <td className="pe-4">
                                  <div className="d-flex align-items-center">
                                    <div className="progress flex-grow-1 me-3" style={{ height: '10px', borderRadius: '10px', backgroundColor: '#e9ecef' }}>
                                      <div 
                                        className="progress-bar" 
                                        role="progressbar" 
                                        style={{ 
                                          width: `${porcentaje}%`,
                                          backgroundColor: i % 2 === 0 ? 'var(--uni-primary)' : 'var(--uni-accent)' // Alternar colores
                                        }}
                                      ></div>
                                    </div>
                                    <span className="small fw-bold text-muted" style={{minWidth: '45px'}}>{porcentaje.toFixed(0)}%</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                  {/* Se eliminó el gráfico de torta por ahora para centrarse en una tabla limpia y moderna, 
                      ya que React-Bootstrap no incluye gráficos nativos. */}
                </Row>
              ) : (
                <div className="open-answers-section">
                  <h6 className="text-muted mb-3 text-uppercase small fw-bold">Comentarios Recientes</h6>
                  <div className="answers-scroll-area custom-scrollbar p-2">
                    {preguntaStats.respuestas.length > 0 ? (
                      <Row>
                        {preguntaStats.respuestas.map((respuesta, idx) => (
                          <Col md={6} key={idx} className="mb-3">
                            <div className="answer-bubble p-3 h-100 rounded-3 bg-light border-start border-4 border-warning">
                              <i className="bi bi-chat-quote-fill text-warning opacity-50 mb-2 d-block"></i>
                              <p className="mb-0 text-dark fst-italic">"{respuesta}"</p>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <div className="text-center py-4 text-muted bg-light rounded-3">
                        <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                        Sin respuestas de texto aún.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};