import { Card, Button, Badge, Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
import { useEncuestas } from '../hooks/useEncuestas';
import '../styles/Encuestas.css';
import { EstadoEncuesta, Cursado } from "../types/encuestasTypes";

export const EncuestasIncompletas = () => {
    const { encuestas, loading, error, refetch } = useEncuestas();

    const encuestasIncompletas = encuestas.filter(encuesta => encuesta.estado === EstadoEncuesta.ABIERTA);

    const getBadgeVariant = (estado: EstadoEncuesta) => {
        return estado === EstadoEncuesta.ABIERTA ? 'danger' : 'success';
    };

    const getCursadoBadgeVariant = (cursado: Cursado) => {
        switch (cursado) {
            case Cursado.PrimerCuatrimestre:
                return 'primary';
            case Cursado.SegundoCuatrimestre:
                return 'secondary';
            case Cursado.Anual:
                return 'warning';
            default:
                return 'dark';
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
                    <p className="loading-text">Cargando encuestas...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Error al cargar las encuestas: {error}
                </Alert>
                <Button variant="outline-primary" onClick={refetch}>
                    Reintentar
                </Button>
            </Container>
        );
    }

    return (
        <Container className="encuestas-container">
            <div className="header-section">
                <h1 className="page-title">
                    <i className="bi bi-clipboard-data me-3"></i>
                    Encuestas Incompletas
                </h1>
                <p className="page-subtitle">
                    Listado de encuestas pendientes de completar
                </p>
            </div>

            {encuestasIncompletas.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <i className="bi bi-inbox"></i>
                    </div>
                    <h3>No hay encuestas incompletas</h3>
                    <p>Todas las encuestas están completadas o no hay encuestas abiertas.</p>
                </div>
            ) : (
                <Row>
                    {encuestasIncompletas.map((encuesta) => (
                        <Col md={6} lg={4} key={encuesta.id} className="mb-4">
                            <Card className="encuesta-card h-100">
                                <Card.Header className="card-header-custom">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Badge 
                                            bg={getBadgeVariant(encuesta.estado)}
                                            className="estado-badge"
                                        >
                                            {encuesta.estado.toUpperCase()}
                                        </Badge>
                                        <Badge 
                                            bg={getCursadoBadgeVariant(encuesta.cursado)}
                                            className="cursado-badge"
                                        >
                                            {encuesta.cursado}
                                        </Badge>
                                    </div>
                                </Card.Header>
                                
                                <Card.Body className="card-body-custom">
                                    <Card.Title className="asignatura-title">
                                        {encuesta.asignatura}
                                    </Card.Title>
                                    
                                    <div className="encuesta-details">
                                        <div className="detail-item">
                                            <i className="bi bi-calendar-event me-2"></i>
                                            <strong>Fecha límite:</strong>
                                            <span className="ms-2">{formatearFecha(encuesta.fecha_fin)}</span>
                                        </div>
                                    </div>
                                </Card.Body>
                                
                                <Card.Footer className="card-footer-custom">
                                    <div className="d-grid gap-2">
                                        <Button 
                                            variant={encuesta.estado === EstadoEncuesta.ABIERTA ? "primary" : "secondary"}
                                            disabled={encuesta.estado === EstadoEncuesta.CERRADA}
                                            className="action-btn"
                                        >
                                            {encuesta.estado === EstadoEncuesta.ABIERTA 
                                                ? "Completar Encuesta" 
                                                : "Encuesta Cerrada"
                                            }
                                        </Button>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}