import React from 'react';
import { Card, Button, Badge, Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
import { useInformes } from '../hooks/useInformes';
import { EstadoInforme } from '../hooks/useInformes';

import SeleccionCarrera from './SeleccionCarrera';

export const PanelDepartamento: React.FC = () => {
    const { informes, loading, error, refetch } = useInformes();
    
    const informesIncompletos = informes.filter(informe => informe.estado === EstadoInforme.ABIERTO);
    
    const getBadgeVariant = (estado: EstadoInforme) => {
        return estado === EstadoInforme.ABIERTO ? 'danger' : 'success';
    };
    
    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-3" variant="primary">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                    <p className="loading-text">Cargando informes...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Error al cargar las informes: {error}
                </Alert>
                <Button variant="outline-primary" onClick={refetch}>
                    Reintentar
                </Button>
            </Container>
        );
    }

    // ver este container para hacer hdu
    return(
        <Container className="informes-container">
            <div className="header-section d-flex justify-content-between align-items-start mb-4">
                <div>
                    <h1 className="page-title">
                        <i className="bi bi-clipboard-data me-3"></i>
                        Informes Incompletos
                    </h1>
                    <p className="page-subtitle">
                        Listado de informes pendientes de completar
                    </p>
                </div>

                {/**/}
                <div>
                    {/* boton para refresh dea*/}
                    <Button variant="outline-secondary" onClick={refetch} className="me-2">Actualizar</Button>
                </div>
            </div>

            {/*inserto el selector de carrera*/}
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title className="mb-2">Seleccionar carrera (contexto para informes)</Card.Title>
                            <Card.Text className="text-muted mb-3">
                                Elegí la carrera para completar el informe . La seleccion se guarda en el navegador.
                            </Card.Text>

                            {/*muestra lista, filtra, guarda en localstorage y redirige o eso es la intencion  */}
                            <SeleccionCarrera />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* lista informes incompletos */}
            {informesIncompletos.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <i className="bi bi-inbox"></i>
                    </div>
                    <h3>No hay informes incompletos</h3>
                    <p>Todas los informes están terminados o no hay informes abiertos.</p>
                </div>
            ) : (
            <ul className="list-group">
                {informesIncompletos.map((informe) => (
                    <li
                        key={informe.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <strong>Asignatura:</strong> {informe.codigo_actividad_curricular} <br />
                            <strong>Docente:</strong> {informe.docente_responsable} <br />
                            <strong>Año:</strong> {informe.ciclo_lectivo} <br />
                            <span className={`badge bg-${informe.estado === EstadoInforme.ABIERTO ? "danger" : "success"}`}>
                                {informe.estado === EstadoInforme.ABIERTO ? "Pendiente" : "Completado"}
                            </span>
                        </div>

                        <Button
                            variant="primary"
                            disabled={informe.estado === EstadoInforme.CERRADO}
                        >
                            Completar Informe
                        </Button>
                    </li>
                ))}
            </ul>
        )}
    </Container>
    );
};

export default PanelDepartamento;
