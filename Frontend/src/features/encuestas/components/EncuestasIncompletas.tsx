import { Card, Button, Badge, Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useEncuestas } from '../hooks/useEncuestas';
import '../styles/Encuestas.css';

export const EncuestasIncompletas = () => {

    // Formatea el ciclo lectivo
    const formatearDuracion = (ciclo: string) => {
        if (!ciclo) return "";

        const partes = ciclo.split("-");
        if (partes.length < 2) return ciclo;

        const duracion = partes[1].toLowerCase();

        if (duracion.includes("primer")) return "1er Cuatrimestre";
        if (duracion.includes("segundo")) return "2do Cuatrimestre";
        if (duracion.includes("anual")) return "Anual";

        return duracion;
    };

    const navigate = useNavigate();
    const { encuestas, loading, error, refetch } = useEncuestas();

    useEffect(() => {
        refetch();
    }, []);

    const encuestasIncompletas = encuestas;
    const alumnoId = Number(localStorage.getItem("alumno_id") || "1");

    const handleCompletarEncuesta = (encuestaId: number, nombreEncuesta: string) => {
        navigate(`/alumno/encuestas/${encuestaId}/completar`, {
            state: {
                alumnoId: alumnoId,
                encuestaId: encuestaId,
                nombreEncuesta: nombreEncuesta
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
        <Container className="encuestas-container py-4">
            <div className="header-section mb-4">
                <h1 className="page-title">
                    <i className="bi bi-clipboard-data me-3"></i>
                    Encuestas Pendientes
                </h1>
                <p className="page-subtitle text-muted">
                    Completa las encuestas de tus asignaturas
                </p>
            </div>

            {encuestasIncompletas.length === 0 ? (
                <div className="empty-state text-center py-5">
                    <div className="empty-icon mb-3">
                        <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h3>Todo al día</h3>
                    <p className="text-muted">No tienes encuestas pendientes en este momento.</p>
                </div>
            ) : (
                <Row>
                    {encuestasIncompletas.map((encuesta) => (
                        <Col md={12} lg={6} key={encuesta.id} className="mb-4">
                            <Card className="encuesta-card h-100 shadow-sm border-0">
                                <Card.Header className="bg-primary text-white">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Badge bg="danger" text="white" className="px-3 py-2">
                                            <i className="bi bi-exclamation-circle me-1"></i>
                                            PENDIENTE
                                        </Badge>
                                    </div>
                                </Card.Header>
                                
                                <Card.Body>
                                    <Card.Title className="mb-3 fw-bold">
                                        <i className="bi bi-book me-2"></i>
                                        {encuesta.asignatura}
                                    </Card.Title>
                                    
                                    <div className="encuesta-details">
                                        <div className="detail-item mb-3 p-3 bg-light rounded">

                                            {/* Docente */}
                                            <div className="mb-3">
                                                <i className="bi bi-person-fill me-2 text-primary"></i>
                                                <strong>Docente:</strong> {encuesta.docente}
                                            </div>

                                            {/* Año */}
                                            <div className="mb-3">
                                                <i className="bi bi-calendar me-2 text-primary"></i>
                                                <strong>Año:</strong> {encuesta.anio}
                                            </div>

                                            {/* Ciclo Lectivo */}
                                            <div className="mb-1">
                                                <i className="bi bi-calendar-event me-2 text-primary"></i>
                                                <strong>Ciclo lectivo:</strong> {formatearDuracion(encuesta.ciclo_lectivo)}

                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                                
                                <Card.Footer className="bg-white border-top">
                                    <div className="d-grid">
                                        <Button 
                                            variant="primary"
                                            size="lg"
                                            onClick={() =>
                                                handleCompletarEncuesta(
                                                    encuesta.id, 
                                                    encuesta.nombre
                                                )
                                            }
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
