import React, { useEffect, useState } from 'react';
import { Card, Button, Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
import { useInformes, EstadoInforme } from '../hooks/useInformes';
import SeleccionCarrera from './SeleccionCarrera';
import { useNavigate } from "react-router-dom";

export const PanelDepartamento: React.FC = () => {
  const [carreraSeleccionada, setCarreraSeleccionada] = useState<{ id: number; nombre: string } | null>(null);

  const navigate = useNavigate(); // <--- 🔥 IMPORTANTE

  useEffect(() => {
    const stored = localStorage.getItem("carreraSeleccionada");
    if (stored) setCarreraSeleccionada(JSON.parse(stored));

    const handleCarreraChanged = (e: any) => {
      console.log("🎓 Carrera cambiada:", e.detail);
      setCarreraSeleccionada(e.detail);
    };

    window.addEventListener("carreraChanged", handleCarreraChanged);
    return () => window.removeEventListener("carreraChanged", handleCarreraChanged);
  }, []);

  const { informes, loading, error, refetch } = useInformes(carreraSeleccionada?.id);

  const informesIncompletos = informes.filter(
    (i) => i.estado === EstadoInforme.ABIERTO || !i.estado
  );

  return (
    <Container className="informes-container mt-4">
      <h1 className="mb-3">Panel de Informes</h1>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Seleccionar carrera</Card.Title>
              <SeleccionCarrera />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {carreraSeleccionada && (
        <div className="mb-3 text-secondary">
          <strong>Carrera seleccionada:</strong> {carreraSeleccionada.nombre}
        </div>
      )}

      {loading && (
        <div className="text-center">
          <Spinner animation="border" /> <p>Cargando informes...</p>
        </div>
      )}

      {error && <Alert variant="danger">Error: {error}</Alert>}

      {!loading && informesIncompletos.length === 0 && (
        <p className="text-muted text-center mt-4">No hay informes para esta carrera.</p>
      )}

      {!loading && informesIncompletos.length > 0 && (
        <ul className="list-group">
          {informesIncompletos.map((inf) => (
            <li key={inf.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{inf.titulo}</strong> <br />
                {inf.fecha && <small>{inf.fecha}</small>}
              </div>

              {/* 🔥 AHORA SÍ NAVEGA */}
              <Button 
                variant="primary"
                onClick={() => navigate("/departamento/informe-sintetico/cabecera")}
              >
                Completar
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 text-end">
        <Button variant="outline-secondary" onClick={() => refetch()}>
          🔄 Actualizar
        </Button>
      </div>
    </Container>
  );
};

export default PanelDepartamento;
