import { Card, Button, Badge, Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEncuestas } from '../hooks/useEncuestas';
import '../styles/Encuestas.css';
import { EstadoEncuesta, Cursado } from "../types/encuestaTypes";

export const EncuestasIncompletas = () => {
    const navigate = useNavigate();
    const { encuestas, loading, error, refetch } = useEncuestas();

    // Filtrar solo encuestas abiertas
    const encuestasIncompletas = encuestas.filter(
        encuesta => encuesta.estado === EstadoEncuesta.ABIERTA
    );

    // ID del alumno (temporal, debería venir de auth)
    const alumnoId = 1;

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
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleCompletarEncuesta = (encuestaId: number, asignatura: string) => {
        // Navegar al formulario de encuesta con los datos necesarios
        navigate(`/alumno/encuesta/${encuestaId}/encuesta`, {
            state: {
                alumnoId: alumnoId,
                encuestaId: encuestaId,
                nombreAsignatura: asignatura,
                asignaturaId: encuestaId 
            }
        });
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-3" variant="primary">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                    <p className="loading-text">Cargando encuestas incompletas...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    <Alert.Heading>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Error al cargar las encuestas
                    </Alert.Heading>
                    <p className="mb-3">{error}</p>
                    <Button variant="outline-danger" onClick={refetch}>
                        <i className="bi bi-arrow-clockwise me-2"></i>
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
                    <i className="bi bi-clipboard-data me-3"></i>
                    Encuestas Incompletas
                </h1>
                <p className="page-subtitle">
                    Selecciona una encuesta para completar
                </p>
            </div>

            {encuestasIncompletas.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <i className="bi bi-inbox"></i>
                    </div>
                    <h3>No hay encuestas pendientes</h3>
                    <p>Todas las encuestas están completadas o no hay encuestas abiertas en este momento.</p>
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
                                            PENDIENTE
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
                                            <i className="bi bi-calendar-event me-2 text-danger"></i>
                                            <strong>Fecha límite:</strong>
                                            <span className="ms-2 text-danger">
                                                {formatearFecha(encuesta.fecha_fin)}
                                            </span>
                                        </div>
                                        
                                        <div className="detail-item mt-2">
                                            <i className="bi bi-info-circle me-2 text-muted"></i>
                                            <span className="text-muted">
                                                Encuesta de satisfacción académica
                                            </span>
                                        </div>
                                    </div>
                                </Card.Body>
                                
                                <Card.Footer className="card-footer-custom">
                                    <div className="d-grid gap-2">
                                        <Button 
                                            variant="primary"
                                            className="action-btn"
                                            onClick={() => handleCompletarEncuesta(encuesta.id, encuesta.asignatura)}
                                        >
                                            <i className="bi bi-pencil-square me-2"></i>
                                            Completar Encuesta
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
};