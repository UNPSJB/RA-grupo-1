import React from 'react';
import { Link } from 'react-router-dom';
import { docenteService, DocenteStats } from '../services/docenteService';

export const PanelDocente: React.FC = () => {
  // DATOS HARCODEADOS ACA VAN CON LA API
  const docenteData = {
    materias: 3,
    semestre: "2025",
    alumnos: 105,
    encuestasCompletadas: 85,
    evaluacionPromedio: 3.7
  };

  return (
    <div className="container-fluid">
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
                  <h6 className="card-title text-muted text-uppercase small">Total alumnos</h6>
                  <h2 className="fw-bold text-success mb-1">{docenteData.alumnos}</h2>
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
                    de {docenteData.alumnos} alumnos
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
                  <p className="mb-1">15 alumnos completaron encuesta de Algebra</p>
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