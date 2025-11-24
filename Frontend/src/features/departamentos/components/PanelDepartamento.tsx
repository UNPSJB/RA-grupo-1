import React, { useEffect, useState } from 'react';
import { Card, Button, Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
import { Informe, useInformes, EstadoInforme } from "../hooks/useInformes";
import SeleccionCarrera from './SeleccionCarrera';
import { Link } from "react-router-dom";

export const PanelDepartamento: React.FC = () => {
  const [carreraSeleccionada, setCarreraSeleccionada] = useState<{ id: number; nombre: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("carreraSeleccionada");
    if (stored) setCarreraSeleccionada(JSON.parse(stored));

    const handleCarreraChanged = (e: any) => {
      console.log("Carrera cambiada:", e.detail);
      setCarreraSeleccionada(e.detail);
    };

    window.addEventListener("carreraChanged", handleCarreraChanged);
    return () => window.removeEventListener("carreraChanged", handleCarreraChanged);
  }, []);

  const { informes, loading, error, refetch } = useInformes(carreraSeleccionada?.id) as {
    informes: Informe[],
    loading: boolean,
    error: string | null,
    refetch: () => void
  };

  const informesIncompletos = informes.filter(
    (i) => i.estado === EstadoInforme.ABIERTO || !i.estado
  );

  return (
    <Container>

      {/* ---- SECCIÓN DE CARDS ---- */}
      <Row className="mb-4">

        {/* Card Seleccionar Carrera */}
        <Col md={7}>
          <Card>
            <Card.Body>
              <Card.Title>Seleccionar carrera</Card.Title>
              <SeleccionCarrera />
            </Card.Body>
          </Card>
        </Col>

        {/* NUEVA CARD: Formularios Pendientes */}
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Formularios pendientes</Card.Title>
              <Link to="/departamento/pendientes" className="btn btn-warning w-100">
                Ver Formularios Pendientes
              </Link>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      {/* Carrera seleccionada */}
      {carreraSeleccionada && (
        <div className="mb-3 text-secondary">
          <strong>Carrera seleccionada:</strong> {carreraSeleccionada.nombre}
        </div>
      )}

      {/* Estado vacío */}
      {!loading && informesIncompletos.length === 0 && carreraSeleccionada && (
        <Alert variant="success">
           ¡Felicitaciones! No hay informes sintéticos pendientes de completar.
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" /> <p>Cargando informes...</p>
        </div>
      )}

      {/* Error */}
      {error && <Alert variant="danger">Error: {error}</Alert>}

      {/* Listado de informes */}
      {!loading && informesIncompletos.length > 0 && (
        <ul className="list-group">
          {informesIncompletos.map((inf) => (
            <li
              key={inf.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{inf.titulo}</strong> <br />
                {inf.fecha && <small>{inf.fecha}</small>}
              </div>

              {/* arreglo de boton */}
              <Button
                variant="primary"
                onClick={() => {
                  localStorage.setItem("informe_sintetico_base_id", String(inf.id));
                  window.location.href = "/departamento/informe-sintetico/cabecera";
                }}
              >
                Completar
              </Button>

            </li>
          ))}
        </ul>
      )}

      {/* Botón actualizar */}
      <div className="mt-3 text-end">
        <Button variant="outline-secondary" onClick={() => refetch()}>
          🔄 Actualizar
        </Button>
      </div>

    </Container>
  );
};

export default PanelDepartamento;
