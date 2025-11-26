import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../styles/PanelAlumno.css";

export const PanelAlumno = () => {
  const [stats, setStats] = useState({
    incompletas: 0,
    completadas: 0,
  });

  useEffect(() => {
    const alumno_id = localStorage.getItem("alumno_id");

    if (alumno_id) {
      fetch(`http://127.0.0.1:8000/encuestas/alumno/${alumno_id}/stats`)
        .then(res => res.json())
        .then(data => {
          setStats({
            incompletas: data.incompletas || 0,
            completadas: data.completadas || 0
          });
        })
        .catch(err => console.error("Error trayendo métricas:", err));
    }
  }, []);

  // Definimos las métricas con sus tipos de visualización específicos
  const metricas = [
    {
      titulo: "incompletas",
      valor: stats.incompletas,
      icono: "bi-hourglass-split",
      type: "warning", // Amarillo: Atención
      descripcion: "Encuestas por realizar"
    },
    {
      titulo: "Completadas",
      valor: stats.completadas,
      icono: "bi-check-circle-fill",
      type: "success", 
      descripcion: "Tus encuestas finalizadas"
    },
    {
      titulo: "Total Encuestas",
      valor: stats.incompletas + stats.completadas,
      icono: "bi-collection-fill",
      type: "primary",
      descripcion: "Historial completo"
    }
  ];

  return (
    <div className="panel-alumno animate-fade-in">
      
      {/* Header Institucional */}
      <div className="alumno-dashboard-header py-5">
        <Container>
          <div className="d-flex align-items-center animate-fade-in delay-0">
            <img
              src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif"
              width="40"
              alt="mano saludando"
              className="me-3"
            />
            <div>
               <p className="text-white-50 mb-0">Bienvenido al panel de alumno</p>
            </div>
          </div>
        </Container>
      </div>

      {/* Contenido principal superpuesto */}
      <Container className="content-overlay pb-5">
        <Row className="g-4">
          {metricas.map((metrica, index) => (
            <Col key={index} lg={4} md={6}>
              <Card className={`metrica-card h-100 shadow-sm border-0 animate-slide-up delay-${index}`}>
                <Card.Body className="d-flex align-items-center p-4">
                  
                  {/* Icono Circular */}
                  <div className={`icon-wrapper type-${metrica.type} me-4`}>
                    <i className={`bi ${metrica.icono}`} />
                  </div>
                  
                  {/* Textos */}
                  <div>
                    <h6 className="text-uppercase text-muted small fw-bold mb-1 letter-spacing-1">
                      {metrica.titulo}
                    </h6>
                    <div className="card-value mb-0">
                      {metrica.valor}
                    </div>
                    <small className="description-text">
                      {metrica.descripcion}
                    </small>
                  </div>

                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row> 
      </Container>
    </div>
  );
};