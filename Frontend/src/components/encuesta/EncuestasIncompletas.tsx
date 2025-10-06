import { Card, Button, Badge, Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
import { useEncuestas } from '../../hooks/useEncuestas';
import '../../styles/Encuestas.css';
import { EstadoEncuesta, Cursado, Encuesta } from '../../types/types';
export default function EncuestasIncompletas() {
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

    return (
    <Container className="encuestas-container">
        <div className="header-section">
            <h1 className="titulo">
                <i className="bi bi-exclamation-circle me-3"></i>
                 Encuestas Incompletadas
            </h1>
            <p className="page-subtitle">
                Listado de encuestas que tenes pendientes por contestar
            </p>
        </div>

        {encuestasIncompletas.length === 0 ? (
            <div className="empty-state">
                <div className="empty-icon">
                    <i className="bi bi-clipboard-check"></i>
                </div>
                <h3>No tenes encuestas Incompletas</h3>
                <p>Se completaron todas las encuestas.</p>
            </div>
        ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {encuestasIncompletas.map((encuesta) => (
                    <Col key={encuesta.id}>
                        <Card className="encuesta-card text-center h-100">
                            <Card.Body>
                                <div className="encuesta-icon-Incompletada mb-3">
                                    <i className="bi bi-clipboard2-x-fill text-danger fs-1" text-success></i>
                                </div>

                                <Card.Title className="asignatura-title mb-2">
                                    {encuesta.asignatura}
                                </Card.Title>

                                <div className="encuesta-meta mb-2 fecha-vence">
                                    <i className="bi bi-calendar-x"></i>
                                    <span> Se vence el: {encuesta.fecha_fin}</span>
                                </div>

                                <div className="mb-3">
                                    <Badge 
                                        bg={getCursadoBadgeVariant(encuesta.cursado)}
                                        className="me-2"
                                    >
                                        {encuesta.cursado}
                                    </Badge>
                                    <Badge bg="danger">
                                        INCOMPLETA
                                    </Badge>
                                </div>

                                <Button 
                                    variant="primary"
                                    size="sm"
                                    className="w-100"
                                >
                                    Responder encuesta
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
