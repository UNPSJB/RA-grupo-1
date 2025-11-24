import React, { useEffect, useState } from 'react';
import { Card, Button, Spinner, Alert, Row, Col, Container } from 'react-bootstrap';
// Nota: Asegúrate de que las rutas a tus hooks y componentes sean correctas
import { useInformes, EstadoInforme } from '../hooks/useInformes'; 
import SeleccionCarrera from './SeleccionCarrera';
import { useNavigate } from "react-router-dom";
import { ListChecks, AlertTriangle, Info } from 'lucide-react'; // Íconos para la vista
import '../styles/PanelDepartamento.css'; 

// Asegúrate de que este tipo de dato coincida con la estructura de tu hook
interface Informe {
    id: number;
    titulo: string;
    fecha?: string;
    estado: EstadoInforme;
    // ... otros campos del informe
}

export const PanelDepartamento: React.FC = () => {
  const [carreraSeleccionada, setCarreraSeleccionada] = useState<{ id: number; nombre: string } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("carreraSeleccionada");
    if (stored) setCarreraSeleccionada(JSON.parse(stored));

    const handleCarreraChanged = (e: any) => {
      console.log(" Carrera cambiada:", e.detail);
      setCarreraSeleccionada(e.detail);
    };

    window.addEventListener("carreraChanged", handleCarreraChanged);
    return () => window.removeEventListener("carreraChanged", handleCarreraChanged);
  }, []);

  // Asumimos que useInformes devuelve el tipo Informe[]
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
    <Container className="informes-container panel-departamento-view">
      
      <div className="page-header mb-4">
        <ListChecks size={30} className="header-icon" />
        <h1 className="page-title">Gestión de Informes Sintéticos Pendientes</h1>
      </div>

      <Row className="mb-5">
        <Col>
          <Card className="selection-card shadow-sm"> 
            <Card.Body>
              <Card.Title className="card-title-custom">
                Elegir Carrera para Filtrar
              </Card.Title>
              <SeleccionCarrera />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {carreraSeleccionada && (
        <Alert variant="light" className="selected-tag d-flex align-items-center">
          <Info size={20} className="me-2"/>
          <strong>Mostrando informes para:</strong> {carreraSeleccionada.nombre}
        </Alert>
      )}

      {loading && (
        <div className="text-center loading-state">
          <Spinner animation="border" variant="primary" /> 
          <p className="mt-2 text-primary">Cargando informes pendientes...</p>
        </div>
      )}

      {error && <Alert variant="danger" className="d-flex align-items-center"><AlertTriangle size={20} className="me-2"/>Error al cargar: {error}</Alert>}

      {/* Mensaje si no ha seleccionado carrera */}
      {!loading && !carreraSeleccionada && (
        <Alert variant="info" className="empty-state-alert d-flex align-items-center">
            <Info size={20} className="me-2"/>
          <p className="mb-0">👆 Por favor, **selecciona una carrera** arriba para cargar sus informes pendientes.</p>
        </Alert>
      )}
      
      {!loading && informesIncompletos.length === 0 && carreraSeleccionada && (
        <Alert variant="success" className="empty-state-alert">
          <p className="mb-0">✅ ¡Felicitaciones! No hay informes sintéticos pendientes de completar para esta carrera.</p>
        </Alert>
      )}

      {/* LISTA DE INFORMES PENDIENTES (Corregido) */}
      {!loading && informesIncompletos.length > 0 && (
        <div className="informes-list-wrapper">
          <h4 className="list-heading">Informes Pendientes ({informesIncompletos.length})</h4>
          <ul className="list-group list-group-flush">
            {informesIncompletos.map((inf) => ( // <-- Sintaxis corregida
              <li
                key={inf.id}
                className="list-group-item item-custom d-flex justify-content-between align-items-center"
              >
                <div className="informe-info">
                  <strong className="informe-title">{inf.titulo}</strong> <br />
                  {inf.fecha && <small className="informe-date">Creado el: {inf.fecha}</small>}
                </div>

                <Button
                  variant="primary"
                  className="action-button"
                  onClick={() => {
                    localStorage.setItem(
                      "informe_sintetico_base_id",
                      String(inf.id)
                    );
                    navigate("/departamento/informe-sintetico/cabecera");
                  }}
                >
                  Completar
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default PanelDepartamento;