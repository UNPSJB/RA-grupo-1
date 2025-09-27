import { Card, Button, Badge, Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
import { useEncuestas } from '../hooks/useEncuestas';
import '../styles/EncuestasIncompletas.css';


enum EstadoEncuesta {
  ABIERTA = "abierta",
  CERRADA = "cerrada",
}

enum Cursado {
    PrimerCuatrimestre = "cuatrimestre 1",
    SegundoCuatrimestre = "cuatrimestre 2",
    Anual = "Anual"
}

interface Encuesta {
    id: number;
    asignatura: string;
    cursado: Cursado;
    estado: EstadoEncuesta;  
    fecha_fin: string; 
}

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
                    <i className="bi bi-exclamation-circle me-3"></i>
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
                    <p>Todas las encuestas han sido completadas o no hay encuestas abiertas en el sistema.</p>
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
                                            <i className="bi bi-calendar-x me-2"></i>
                                            <strong>Fecha límite:</strong>
                                            <span className="ms-2">{encuesta.fecha_fin}</span>
                                        </div>
                                    </div>
                                </Card.Body>
                                
                                <Card.Footer className="card-footer-custom">
                                    <div className="d-grid gap-2">
                                        <Button 
                                            variant="primary"
                                            className="action-btn"
                                        >
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
}