import { useState } from 'react';
import { Container, Nav, Tab } from 'react-bootstrap';
import { useParams, Navigate } from 'react-router-dom';
import { Navbar } from "../../../components/layout/Navbar/Navbar";
import { Footer } from "../../../components/layout/Footer/Footer";
import '../styles/DetalleMateria.css'

const GraficosTab = () => (
  <div className="tab-content">
    <div className="placeholder-graphic">
      <i className="bi bi-bar-chart display-1 text-muted"></i>
    </div>
  </div>
);

const RespuestasAbiertasTab = () => (
  <div className="tab-content">
    <h3>Respuestas Abiertas</h3>
    <p>Comentarios y sugerencias de los estudiantes.</p>
    <div className="comments-list">
      <div className="comment-item">
        <p>"Excelente docente, muy claro en las explicaciones"</p>
        <small className="text-muted">- Estudiante anónimo</small>
      </div>
      <div className="comment-item">
        <p>"Las clases prácticas fueron muy útiles"</p>
        <small className="text-muted">- Estudiante anónimo</small>
      </div>
    </div>
  </div>
);

const ReporteSinteticoTab = () => (
  <div className="tab-content">
    <h3>Reporte Sintético</h3>
    <p>Resumen general de los resultados de la encuesta.</p>
    <div className="synthetic-report">
      <div className="report-card">
        <h5>Puntuación General</h5>
        <div className="score">4.5/5</div>
      </div>
      <div className="report-card">
        <h5>Nivel de Satisfacción</h5>
        <div className="satisfaction">Alto</div>
      </div>
    </div>
  </div>
);

export const DetalleMateria = () => {
  const { materiaId } = useParams<{ materiaId: string }>();
  const [activeTab, setActiveTab] = useState('graficos');

  // Datos de ejemplo de la materia - en tu caso vendrían de una API
  const materiaData = {
    id: parseInt(materiaId || '1' || '2'),
    nombre: "Algoritmica y programación 1",
    codigo: "IF01",
    carrera: "Analista Programador",
    cantidadAlumnos: 45,
    encuestasContestadas: 38,
    porcentajeCompletado: 84
  };
  
  // Si no hay materiaId, redirigir a mis-materias
  if (!materiaId) {
    return <Navigate to="/docente/mis-materias" replace />;
  }

  const detalleNavLinks = [
    { to: "/docente", label: "Panel Principal" },
    { to: "/docente/mis-materias", label: "Mis Materias" }
  ];

  return (
    <div className="detalle-materia-layout">    
      <main className="main-content">
        <Container className="detalle-materia-container">
          {/* Header de la materia */}
          <div className="materia-header">
            <div className="materia-info">
              <h1 className="materia-title">
                <i className="bi bi-journal-bookmark me-3 text-primary"></i>
                {materiaData.nombre}
              </h1>
              <p className="materia-subtitle">
                <span className="badge bg-secondary me-2">{materiaData.codigo}</span>
                {materiaData.carrera}
              </p>
              <div className="materia-stats-overview">
                <div className="stat">
                  <strong>{materiaData.cantidadAlumnos}</strong>
                  <span>Alumnos</span>
                </div>
                <div className="stat">
                  <strong>{materiaData.encuestasContestadas}</strong>
                  <span>Encuestas contestadas</span>
                </div>
                <div className="stat">
                  <strong>{materiaData.porcentajeCompletado}%</strong>
                  <span>Porcentaje</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pestañas de navegación */}
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'graficos')}>
            <Nav variant="tabs" className="custom-tabs">
              <Nav.Item>
                <Nav.Link eventKey="graficos">
                  <i className="bi bi-bar-chart me-2"></i>
                  Gráficos
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="respuestas-abiertas">
                  <i className="bi bi-chat-text me-2"></i>
                  Respuestas Abiertas
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reporte-sintetico">
                  <i className="bi bi-file-text me-2"></i>
                  Reporte Sintético
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content className="tab-content-container">
              <Tab.Pane eventKey="graficos">
                <GraficosTab />
              </Tab.Pane>
              <Tab.Pane eventKey="respuestas-abiertas">
                <RespuestasAbiertasTab />
              </Tab.Pane>
              <Tab.Pane eventKey="reporte-sintetico">
                <ReporteSinteticoTab />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </main>
    </div>
  );
};