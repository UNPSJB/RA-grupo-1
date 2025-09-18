import React from 'react';
import { Card, Button, Badge, Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
import { useEncuestas } from '../hooks/encuestas';
import '../styles/EncuestasIncompletas.css';

// Enums importados del hook (si no están exportados, defínelos aquí)
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
    fecha_fin: number;
}

export default function EncuestasIncompletas() {
    const { encuestas, loading, error, refetch } = useEncuestas();

    // Función para formatear la fecha
    const formatearFecha = (timestamp: number) => {
        const fecha = new Date(timestamp * 1000); // Convertir de timestamp a Date
        return fecha.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Función para obtener el color del badge según el estado
    const getBadgeVariant = (estado: EstadoEncuesta) => {
        return estado === EstadoEncuesta.ABIERTA ? 'success' : 'danger';
    };

    // Función para obtener el color del badge según el cursado
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
                <h1 className="page-title">
                    <i className="bi bi-clipboard-data me-3"></i>
                    Encuestas Incompletas
                </h1>
                <p className="page-subtitle">
                    Listado de encuestas pendientes de completar
                </p>
                <Button 
                    variant="outline-primary" 
                    onClick={refetch}
                    className="refresh-btn"
                >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Actualizar
                </Button>
            </div>

            {encuestas.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <i className="bi bi-inbox"></i>
                    </div>
                    <h3>No hay encuestas disponibles</h3>
                    <p>No se encontraron encuestas en el sistema.</p>
                </div>
            ) : (
                <Row>
                    {encuestas.map((encuesta) => (
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
                                        
                                        <div className="detail-item">
                                            <i className="bi bi-hash me-2"></i>
                                            <strong>ID:</strong>
                                            <span className="ms-2">#{encuesta.id}</span>
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

            <div className="stats-section mt-5">
                <Row>
                    <Col md={4}>
                        <div className="stat-card">
                            <div className="stat-number">{encuestas.length}</div>
                            <div className="stat-label">Total de Encuestas</div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="stat-card">
                            <div className="stat-number">
                                {encuestas.filter(e => e.estado === EstadoEncuesta.ABIERTA).length}
                            </div>
                            <div className="stat-label">Abiertas</div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="stat-card">
                            <div className="stat-number">
                                {encuestas.filter(e => e.estado === EstadoEncuesta.CERRADA).length}
                            </div>
                            <div className="stat-label">Cerradas</div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Container>
    );
}