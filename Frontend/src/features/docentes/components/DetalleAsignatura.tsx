import { useState } from 'react';
import { Container, Nav, Tab } from 'react-bootstrap';
import { useParams, Navigate } from 'react-router-dom';
import '../styles/DetalleAsignatura.css'

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

export const DetalleAsignatura = () => {
  const { asignaturaId } = useParams<{ asignaturaId: string }>();
  const [activeTab, setActiveTab] = useState('graficos');

  // Datos de ejemplo para la api
  const asignaturaData = {
    id: parseInt(asignaturaId || '1'),
    nombre: "Algoritmica y programación 1",
    codigo: "IF01",
    carrera: "Analista Programador",
    cantidadAlumnos: 45,
    encuestasContestadas: 38,
    porcentajeCompletado: 84
  };
  
  if (!asignaturaId) {
    return <Navigate to="/docente/mis-asignaturas" replace />;
  }

  const detalleNavLinks = [
    { to: "/docente", label: "Panel Principal" },
    { to: "/docente/mis-asignaturas", label: "Mis asignaturas" }
  ];

  return (
    <div className="detalle-asignatura-layout">    
      <main className="main-content">
        <Container className="detalle-asignatura-container">
          <div className="asignatura-header">
            <div className="asignatura-info">
              <h1 className="asignatura-title">
                <i className="bi bi-journal-bookmark me-3 text-primary"></i>
                {asignaturaData.nombre}
              </h1>
              <p className="asignatura-subtitle">
                <span className="badge bg-secondary me-2">{asignaturaData.codigo}</span>
                {asignaturaData.carrera}
              </p>
              <div className="asignatura-stats-overview">
                <div className="stat">
                  <strong>{asignaturaData.cantidadAlumnos}</strong>
                  <span>Alumnos</span>
                </div>
                <div className="stat">
                  <strong>{asignaturaData.encuestasContestadas}</strong>
                  <span>Encuestas contestadas</span>
                </div>
                <div className="stat">
                  <strong>{asignaturaData.porcentajeCompletado}%</strong>
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