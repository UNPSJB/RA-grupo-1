import { Card, Button, Badge, Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
import { useEncuestas } from "../../hooks/useEncuestas";
import '../../styles/Encuestas.css'; 
import { EstadoEncuesta, Cursado, Encuesta } from '../../types/types';

export default function EncuestasCompletas() {
    const { encuestas, loading, error, refetch } = useEncuestas();
    
    const encuestasCompletas = encuestas.filter(encuesta => {
        return encuesta.estado === EstadoEncuesta.CERRADA;
    });

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
            <h1 className="titulo">
                <i className="bi bi-check-circle me-3"></i>
                Encuestas Completadas
            </h1>
            <p className="page-subtitle">
                Listado de encuestas que completaste
            </p>
        </div>

        {encuestasCompletas.length === 0 ? (
            <div className="empty-state">
                <div className="empty-icon">
                    <i className="bi bi-clipboard-check"></i>
                </div>
                <h3>No tenes encuestas completadas</h3>
                <p>Se completaron todas las encuestas.</p>
            </div>
        ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {encuestasCompletas.map((encuesta) => (
                    <Col key={encuesta.id}>
                        <Card className="encuesta-card text-center h-100">
                            <Card.Body>
                                <div className="encuesta-icon-completada mb-3">
                                    <i className="bi bi-check-circle-fill fs-2 text-success"></i>
                                </div>

                                <Card.Title className="asignatura-title mb-2">
                                    {encuesta.asignatura}
                                </Card.Title>

                                <div className="encuesta-meta mb-2">
                                    <i className="bi bi-calendar-check me-2"></i>
                                    <span>Completada el: {encuesta.fecha_fin}</span>
                                </div>

                                <div className="mb-3">
                                    <Badge 
                                        bg={getCursadoBadgeVariant(encuesta.cursado)}
                                        className="me-2"
                                    >
                                        {encuesta.cursado}
                                    </Badge>
                                    <Badge bg="success">
                                        COMPLETADA
                                    </Badge>
                                </div>

                                <Button 
                                    variant="outline-primary"
                                    size="sm"
                                    className="w-100"
                                >
                                    Ver Respuestas
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        )}
    </Container>
);

}