import { Card, Button, Badge, Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useEncuestas } from '../hooks/useEncuestas';
import '../styles/Encuestas.css';
import { EstadoEncuesta, Cursado } from "../types/encuestaTypes";

export const EncuestasIncompletas = () => {
    const navigate = useNavigate();
    const { encuestas, loading, error, refetch } = useEncuestas();

    // Refrescar datos cuando el componente se monta
    useEffect(() => {
        refetch();
    }, []);

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
                return 'info';
            case Cursado.Anual:
                return 'warning';
            default:
                return 'dark';
        }
    };

    const formatearCursado = (cursado: string) => {
        const cursadoUpper = cursado.toUpperCase();
        if (cursadoUpper.includes('PRIMER')) return '1° Cuatrimestre';
        if (cursadoUpper.includes('SEGUNDO')) return '2° Cuatrimestre';
        if (cursadoUpper.includes('ANUAL')) return 'Anual';
        return cursado;
    };

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleCompletarEncuesta = (encuestaId: number, titulo: string, asignaturaId: number) => {
        navigate(`/alumno/encuestas/${encuestaId}/completar`, {
            state: {
                alumnoId: alumnoId,
                encuestaId: encuestaId,
                nombreAsignatura: titulo,
                asignaturaId: asignaturaId
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
                            <Card className="encuesta-card h-100 shadow-sm">
                                <Card.Header className="card-header-custom bg-white border-bottom">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Badge 
                                            bg={getBadgeVariant(encuesta.estado)}
                                            className="estado-badge"
                                        >
                                            <i className="bi bi-exclamation-circle me-1"></i>
                                            PENDIENTE
                                        </Badge>
                                        <Badge 
                                            bg={getCursadoBadgeVariant(encuesta.cursado)}
                                            className="cursado-badge"
                                        >
                                            {formatearCursado(encuesta.cursado)}
                                        </Badge>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 mt-2">
                                        <Badge bg="dark" className="px-2 py-1">
                                            <i className="bi bi-mortarboard me-1"></i>
                                            {encuesta.carrera}
                                        </Badge>
                                    </div>
                                </Card.Header>
                                
                                <Card.Body className="card-body-custom">
                                    <Card.Title className="asignatura-title mb-3">
                                        <i className="bi bi-book me-2 text-primary"></i>
                                        {encuesta.titulo}
                                    </Card.Title>
                                    
                                    <div className="encuesta-details">
                                        {encuesta.sede && (
                                            <div className="detail-item mb-2">
                                                <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                                                <strong>Sede:</strong>
                                                <span className="ms-2">
                                                    {encuesta.sede}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className="detail-item mb-2">
                                            <i className="bi bi-calendar-check me-2 text-success"></i>
                                            <strong>Inicio:</strong>
                                            <span className="ms-2">
                                                {formatearFecha(encuesta.fecha_inicio)}
                                            </span>
                                        </div>
                                        
                                        <div className="detail-item">
                                            <i className="bi bi-calendar-x me-2 text-danger"></i>
                                            <strong>Vence:</strong>
                                            <span className="ms-2 text-danger fw-bold">
                                                {formatearFecha(encuesta.fecha_fin)}
                                            </span>
                                        </div>
                                    </div>
                                </Card.Body>
                                
                                <Card.Footer className="card-footer-custom bg-light">
                                    <div className="d-grid gap-2">
                                        <Button 
                                            variant="primary"
                                            className="action-btn"
                                            onClick={() => handleCompletarEncuesta(
                                                encuesta.id, 
                                                encuesta.titulo, 
                                                encuesta.asignatura_id
                                            )}
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