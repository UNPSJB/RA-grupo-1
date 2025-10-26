import { Card, Button, Badge, Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
import { useEncuestas } from "../hooks/useEncuestas";
import '../styles/Encuestas.css'; 
import { EstadoEncuesta, Cursado } from "../types/encuestasTypes";

export const EncuestasCompletas = () => {
    const { encuestas, loading, error, refetch } = useEncuestas();
    
    const encuestasCompletas = encuestas.filter(encuesta => {
        return encuesta.estado === EstadoEncuesta.CERRADA;
    });

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES');
    };

    const getCursadoBadgeVariant = (cursado: Cursado) => {
        switch (cursado) {
            case Cursado.PrimerCuatrimestre:
                return 'primary';
            case Cursado.SegundoCuatrimestre:
                return 'info';
            case Cursado.Anual:
                return 'warning';
            default:
                return 'secondary';
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-3" variant="primary">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                    <p className="loading-text">Cargando las encuestas completadas...</p>
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
                    <i className="bi bi-check-circle-fill me-3 text-success"></i>
                    Encuestas Completas
                </h1>
                <p className="page-subtitle">
                    Listado de encuestas que completaste
                </p>
            </div>

            {encuestasCompletas.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <i className="bi bi-calendar-check"></i>
                    </div>
                    <h3>No hay encuestas completas</h3>
                    <p>No has completado ninguna encuesta todavía.</p>
                </div>
            ) : (
                <Row>
                    {encuestasCompletas.map((encuesta) => (
                        <Col md={6} lg={4} key={encuesta.id} className="mb-4">
                            <Card className="encuesta-card h-100">
                                <Card.Header className="card-header-custom">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Badge 
                                            bg="success"
                                            className="estado-badge"
                                        >
                                            COMPLETADA
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
                                            <strong>Completada el:</strong>
                                            <span className="ms-2">{formatearFecha(encuesta.fecha_fin)}</span>
                                        </div>
                                    </div>
                                </Card.Body>
                                
                                <Card.Footer className="card-footer-custom">
                                    <div className="d-grid gap-2">
                                        <Button 
                                            variant="primary"
                                            className="action-btn"
                                        >
                                            <i className="bi bi-check-circle me-2"></i>
                                            Ver encuesta
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