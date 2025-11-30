import {Card,Button,Badge,Spinner,Alert,Row,Col,Container,}
from "react-bootstrap";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useEncuestasCompletadas } from "../hooks/useEncuestasCompletadas";
import "../styles/Encuestas.css";

export const EncuestasCompletas = () => {
  const { encuestas, loading, error, refetch } = useEncuestasCompletadas();

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Lo que llega del backend ya son encuestas finalizadas
  const encuestasCompletas = encuestas;

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCursadoBadgeVariant = (duracion: string | undefined) => {
    if (!duracion) return "secondary";

    switch (duracion.toUpperCase()) {
      case "PRIMER CUATRIMESTRE":
        return "primary";
      case "SEGUNDO CUATRIMESTRE":
        return "info";
      case "ANUAL":
        return "warning";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="text-center">
          <Spinner
            animation="border"
            role="status"
            className="mb-3"
            variant="primary"
          >
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="loading-text">
            Cargando las encuestas completadas...
          </p>
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
          <Button variant="outline-danger" onClick={refetch}>
            Reintentar
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="encuestas-container">
      <div className="header-section">
        <h1 className="page-title">
          <i className="bi bi-check-circle-fill me-3 text-success" />
          Encuestas Completas
        </h1>
        <p className="page-subtitle">Listado de encuestas que completaste</p>
      </div>

      {encuestasCompletas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="bi bi-calendar-check" />
          </div>
          <h3>No hay encuestas completas</h3>
          <p>No completaste ninguna encuesta todavía.</p>
        </div>
      ) : (
        <Row>
          {encuestasCompletas.map((encuesta) => (
            <Col md={6} lg={4} key={encuesta.id_finalizada} className="mb-4">
              <Card className="encuesta-card h-100">
                <Card.Header className="card-header-custom">
                  <div className="d-flex justify-content-between align-items-center">
                    <Badge bg="success" className="estado-badge">
                      <i className="bi bi-check-circle me-1" />
                      COMPLETADA
                    </Badge>
                    <Badge
                      bg={getCursadoBadgeVariant(encuesta.duracion)}
                      className="cursado-badge"
                    >
                      {encuesta.duracion}
                    </Badge>
                  </div>
                </Card.Header>

                <Card.Body className="card-body-custom">
                  <Card.Title className="asignatura-title">
                    <i className="bi bi-book me-2" />
                    {encuesta.asignatura}
                  </Card.Title>

                  <div className="encuesta-details">
                    <div className="detail-item">
                      <strong>Año:</strong>
                      <span className="ms-2">{encuesta.anio}</span>
                    </div>

                    <div className="detail-item">
                      <strong>Ciclo lectivo:</strong>
                      <span className="ms-2">{encuesta.ciclo_lectivo}</span>
                    </div>



                    <div className="detail-item">
                      <strong>Docente:</strong>
                      <span className="ms-2">{encuesta.docente}</span>
                    </div>

                    <div className="detail-item">
                      <i className="bi bi-calendar-event me-2" />
                      <strong>Completada el:</strong>
                      <span className="ms-2">
                        {formatearFecha(encuesta.fecha_finalizada)}
                      </span>
                    </div>
                  </div>
                </Card.Body>

                <Card.Footer className="card-footer-custom">
                  <div className="d-grid gap-2">
                    <Link to={`/alumno/completadas/${encuesta.id_finalizada}`}>
                      <Button variant="outline-primary" className="action-btn">
                        <i className="bi bi-eye me-2" />
                        Ver mis respuestas
                      </Button>
                    </Link>
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
