import React from 'react';
import { Link } from 'react-router-dom';
import { docenteService, DocenteStats } from '../services/docenteService';

export const PanelDocente: React.FC = () => {
  // Datos de ejemplo 
  const docenteData = {
    materias: 3,
    semestre: "2024-2",
    estudiantes: 105,
    encuestasCompletadas: 85,
    evaluacionPromedio: 3.7
  };

  return (
    <div className="container-fluid">
      {/* Header del Panel */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 bg-light">
            <div className="card-body py-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h1 className="h3 mb-1 text-dark fw-bold">Panel de Docente</h1>
                  <p className="text-muted mb-0">
                    {docenteData.nombre} – Legajo: {docenteData.legajo}
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <button className="btn btn-outline-danger">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="card-title text-muted text-uppercase small">Total Materias</h6>
                  <h2 className="fw-bold text-primary mb-1">{docenteData.materias}</h2>
                  <small className="text-muted">Semestre {docenteData.semestre}</small>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="bi bi-journal-text text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="card-title text-muted text-uppercase small">Total Estudiantes</h6>
                  <h2 className="fw-bold text-success mb-1">{docenteData.estudiantes}</h2>
                  <small className="text-muted">Todas las materias</small>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="bi bi-people text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="card-title text-muted text-uppercase small">Encuestas Completadas</h6>
                  <h2 className="fw-bold text-warning mb-1">{docenteData.encuestasCompletadas}</h2>
                  <small className="text-muted">
                    de {docenteData.estudiantes} estudiantes
                  </small>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <i className="bi bi-clipboard-check text-warning fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="card-title text-muted text-uppercase small">Evaluación Promedio</h6>
                  <h2 className="fw-bold text-info mb-1">{docenteData.evaluacionPromedio}</h2>
                  <small className="text-muted">de 4.0</small>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <i className="bi bi-star text-info fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación entre secciones */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body py-3">
              <div className="row text-center">
                <div className="col-md-4 mb-2 mb-md-0">
                  <Link to="/docente/materias" className="text-decoration-none">
                    <button className="btn btn-outline-primary w-100 py-3 fw-semibold">
                      <i className="bi bi-journal-text me-2"></i>
                      Mis Materias
                    </button>
                  </Link>
                </div>
                <div className="col-md-4 mb-2 mb-md-0">
                  <Link to="/docente/reportes" className="text-decoration-none">
                    <button className="btn btn-outline-success w-100 py-3 fw-semibold">
                      <i className="bi bi-graph-up me-2"></i>
                      Reportes
                    </button>
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link to="/docente/analisis" className="text-decoration-none">
                    <button className="btn btn-outline-info w-100 py-3 fw-semibold">
                      <i className="bi bi-bar-chart me-2"></i>
                      Análisis
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="card-title mb-0">
                <i className="bi bi-clock-history me-2 text-warning"></i>
                Actividad Reciente
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 px-0 py-2">
                  <small className="text-muted">Hoy</small>
                  <p className="mb-1">Nueva encuesta disponible para Matemáticas I</p>
                </div>
                <div className="list-group-item border-0 px-0 py-2">
                  <small className="text-muted">Ayer</small>
                  <p className="mb-1">15 estudiantes completaron encuesta de Física</p>
                </div>
                <div className="list-group-item border-0 px-0 py-2">
                  <small className="text-muted">2 días</small>
                  <p className="mb-1">Actualización del sistema completada</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="card-title mb-0">
                <i className="bi bi-exclamation-triangle me-2 text-danger"></i>
                Acciones Pendientes
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 px-0 py-2">
                  <span className="badge bg-warning me-2">3</span>
                  <span>Encuestas por revisar</span>
                </div>
                <div className="list-group-item border-0 px-0 py-2">
                  <span className="badge bg-info me-2">1</span>
                  <span>Reporte pendiente de envío</span>
                </div>
                <div className="list-group-item border-0 px-0 py-2">
                  <span className="badge bg-success me-2">2</span>
                  <span>Materias sin evaluaciones</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelDocente;