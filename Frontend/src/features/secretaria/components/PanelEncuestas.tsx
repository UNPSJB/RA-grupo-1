import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSecretaria } from '../hooks/useSecretaria';

export const PanelEncuestas = () => {
  const { encuestas, loading, error, cargarEstadisticas } = useSecretaria();
  const navigate = useNavigate();

  const verEstadisticas = async (encuestaId: number) => {
    await cargarEstadisticas(encuestaId);
    navigate(`/secretaria/estadisticas/${encuestaId}`);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4 mb-4">
        <Col xs={12} md={4}>
          <Card className="border-primary h-100">
            <Card.Body className="text-center">
              <i className="bi bi-clipboard-check display-4 text-primary mb-3"></i>
              <h3>{encuestas.length}</h3>
              <Card.Text>Encuestas Activas</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="border-success h-100">
            <Card.Body className="text-center">
              <i className="bi bi-question-circle display-4 text-success mb-3"></i>
              <h3>{encuestas.reduce((acc, enc) => acc + enc.preguntas.length, 0)}</h3>
              <Card.Text>Total de Preguntas</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="border-info h-100">
            <Card.Body className="text-center">
              <i className="bi bi-graph-up display-4 text-info mb-3"></i>
              <h3>45</h3>
              <Card.Text>Respuestas Totales</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Lista de Encuestas</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover>
            <thead className="bg-light">
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Preguntas</th>
                <th>Período</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {encuestas.map((encuesta) => (
                <tr key={encuesta.id}>
                  <td>
                    <strong>{encuesta.titulo}</strong>
                  </td>
                  <td>{encuesta.descripcion}</td>
                  <td>
                    <Badge bg="secondary">{encuesta.preguntas.length}</Badge>
                  </td>
                  <td>
                    <small>
                      {new Date(encuesta.fechaInicio).toLocaleDateString()} - {' '}
                      {new Date(encuesta.fechaFin).toLocaleDateString()}
                    </small>
                  </td>
                  <td>
                    <Badge bg={encuesta.activa ? 'success' : 'secondary'}>
                      {encuesta.activa ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => verEstadisticas(encuesta.id)}
                      className="me-2"
                    >
                      <i className="bi bi-graph-up"></i> Estadísticas
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};