import React from 'react';
import { Link } from 'react-router-dom';
import { docenteService, DocenteStats } from '../services/docenteService';

export const PanelDocente: React.FC = () => {
  // DATOS HARCODEADOS ACA VAN CON LA API
  const docenteData = {
    asignaturas: 3,
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
                  <h6 className="card-title text-muted text-uppercase small">Total Asignaturas</h6>
                  <h2 className="fw-bold text-primary mb-1">{docenteData.asignaturas}</h2>
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
                  <small className="text-muted">Todas las asignaturas</small>
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
    </div>
  );
};

export default PanelDocente;