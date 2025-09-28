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
                <div className="encuestas-list">
                    {encuestasIncompletas.map((encuesta) => (
                        <Card key={encuesta.id} className="encuesta-card-horizontal mb-3">
                            <Card.Body className="card-body-horizontal">
                                <Row className="align-items-center">
                                    <Col xs={12} md={1} className="text-center mb-2 mb-md-0">
                                         <div className="encuesta-icon-excel">
                                            <i className="bi bi-file-earmark-excel"></i>
                                        </div>
                                    </Col>
                                    
                                    <Col xs={12} md={6} className="mb-2 mb-md-0">
                                        <div className="encuesta-info">
                                            <h5 className="asignatura-title-horizontal mb-1">
                                                {encuesta.asignatura}
                                            </h5>
                                            <div className="encuesta-meta">
                                                <div className="fecha-vence mt-1">
                                                    <i className="bi bi-calendar-x me-2"></i>
                                                    <span>Vence el: {encuesta.fecha_fin}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    
                                    <Col xs={12} md={3} className="mb-2 mb-md-0">
                                        <div className="badges-container">
                                            <Badge 
                                                bg={getCursadoBadgeVariant(encuesta.cursado)}
                                                className="cursado-badge-horizontal me-2"
                                            >
                                                {encuesta.cursado}
                                            </Badge>
                                             <Badge 
                                                bg="danger"
                                                className="estado-badge-horizontal"
                                                >
                                                INCOMPLETA
                                            </Badge>
                                        </div>
                                    </Col>
                                    
                                    <Col xs={12} md={2} className="text-end">
                                        <Button 
                                            variant="primary"
                                            className="action-btn-horizontal"
                                            size="sm"
                                        >
                                            Completar Encuesta
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </Container>
    );
}