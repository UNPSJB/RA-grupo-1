import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { useEncuestas } from '../hooks/useEncuestas';

export const EstadisticasEncuesta = () => {
  const { encuestaId } = useParams<{ encuestaId: string }>();
  const navigate = useNavigate();
  const { estadisticas, loading, error, cargarEstadisticas, encuestas } = useEncuestas();

  const encuesta = encuestas.find(e => e.id === parseInt(encuestaId || '0'));

  useEffect(() => {
    if (encuestaId) {
      cargarEstadisticas(parseInt(encuestaId));
    }
  }, [encuestaId]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate('/secretaria/panel')}>
          Volver al Panel
        </Button>
      </Container>
    );
  }

  if (!estadisticas || !encuesta) {
    return (
      <Container>
        <Alert variant="warning">No se encontraron estadísticas para esta encuesta</Alert>
        <Button variant="secondary" onClick={() => navigate('/secretaria/panel')}>
          Volver al Panel
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Button variant="outline-secondary" onClick={() => navigate('/secretaria/panel')} className="mb-3">
            <i className="bi bi-arrow-left me-2"></i>
            Volver al Panel
          </Button>
          <h1 className="h2">{encuesta.titulo}</h1>
          <p className="text-muted">{encuesta.descripcion}</p>
        </Col>
        <Col xs="auto" className="text-end">
          <div className="d-flex flex-column">
            <span className="h4 text-primary">{estadisticas.totalRespuestas}</span>
            <small className="text-muted">Respuestas totales</small>
          </div>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Resumen General</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3} className="text-center">
              <div className="border rounded p-3">
                <i className="bi bi-check-circle display-6 text-success mb-2"></i>
                <h4>{estadisticas.totalRespuestas}</h4>
                <small className="text-muted">Encuestas Completadas</small>
              </div>
            </Col>
            <Col md={3} className="text-center">
              <div className="border rounded p-3">
                <i className="bi bi-question-circle display-6 text-primary mb-2"></i>
                <h4>{estadisticas.preguntas.length}</h4>
                <small className="text-muted">Total de Preguntas</small>
              </div>
            </Col>
            <Col md={3} className="text-center">
              <div className="border rounded p-3">
                <i className="bi bi-calendar display-6 text-info mb-2"></i>
                <h4>{new Date(encuesta.fechaInicio).toLocaleDateString()}</h4>
                <small className="text-muted">Fecha de Inicio</small>
              </div>
            </Col>
            <Col md={3} className="text-center">
              <div className="border rounded p-3">
                <i className="bi bi-calendar-check display-6 text-warning mb-2"></i>
                <h4>{new Date(encuesta.fechaFin).toLocaleDateString()}</h4>
                <small className="text-muted">Fecha de Fin</small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {estadisticas.preguntas.map((preguntaStats, index) => (
        <Card key={preguntaStats.preguntaId} className="mb-4">
          <Card.Header>
            <h6 className="mb-0">
              Pregunta {index + 1}: {preguntaStats.textoPregunta}
            </h6>
            <small className="text-muted">
              Tipo: {preguntaStats.tipo === 'abierta' ? 'Abierta' : 'Cerrada'} | 
              Respuestas: {preguntaStats.respuestas.length}
            </small>
          </Card.Header>
          <Card.Body>
            {preguntaStats.tipo === 'cerrada' && preguntaStats.estadisticas ? (
              <Row>
                <Col md={6}>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Opción</th>
                        <th>Cantidad</th>
                        <th>Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(preguntaStats.estadisticas).map(([opcion, cantidad]) => {
                        const porcentaje = (cantidad / preguntaStats.respuestas.length) * 100;
                        return (
                          <tr key={opcion}>
                            <td>{opcion}</td>
                            <td>{cantidad}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div 
                                  className="progress flex-grow-1 me-2" 
                                  style={{ height: '8px' }}
                                >
                                  <div 
                                    className="progress-bar" 
                                    style={{ width: `${porcentaje}%` }}
                                  ></div>
                                </div>
                                <span>{porcentaje.toFixed(1)}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <div className="text-center">
                    <h6>Distribución de Respuestas</h6>
                    <div className="bg-light rounded p-4">
                      <i className="bi bi-pie-chart display-4 text-muted"></i>
                      <p className="mt-2 text-muted">Gráfico de distribución</p>
                    </div>
                  </div>
                </Col>
              </Row>
            ) : (
              <div>
                <h6>Respuestas Recibidas:</h6>
                <div className="bg-light rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {preguntaStats.respuestas.length > 0 ? (
                    preguntaStats.respuestas.map((respuesta, idx) => (
                      <div key={idx} className="border-bottom pb-2 mb-2">
                        <small>{respuesta}</small>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted mb-0">No hay respuestas para esta pregunta</p>
                  )}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};