import React from 'react';
import { Link } from 'react-router-dom';
import { docenteService, DocenteStats } from '../services/docenteService';
import { useEffect, useState } from 'react';
import { getInformes, Informe } from "../services/informesService";

export const PanelDocente: React.FC = () => {
  // DATOS HARCODEADOS (Idealmente vendrían de una API)
  const docenteData = {
    asignaturas: 3,
    semestre: "2025",
    alumnos: 105,
    encuestasFinalizadas: 85,
    evaluacionPromedio: 3.7
  };

  const [informes, setInformes] = useState<Informe[]>([]);

  useEffect(() => {
    const fetchInformes = async () => {
      try{
        const data = await getInformes();
        setInformes(data);
      } catch (error) {
        console.error("Error al obtener informes:", error);
      }
    };
    fetchInformes();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
            <h3 className="text-dark fw-bold">Panel de Control</h3>
            <p className="text-muted">Resumen académico del ciclo {docenteData.semestre}</p>
        </div>
      </div>

      <div className="row mb-4 g-3">
        {/* Tarjeta 1: Asignaturas */}
        <div className="col-xl-3 col-md-6">
          <div className="card stat-card h-100 shadow-sm border-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="stat-label mb-1">Asignaturas</p>
                  <h2 className="stat-value mb-0">{docenteData.asignaturas}</h2>
                  <small className="text-muted fs-7">Activas este ciclo</small>
                </div>
                <div className="icon-circle bg-primary bg-opacity-10">
                  <i className="bi bi-journal-bookmark-fill text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Alumnos */}
        <div className="col-xl-3 col-md-6">
          <div className="card stat-card h-100 shadow-sm border-success">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="stat-label mb-1">Total Alumnos</p>
                  <h2 className="stat-value mb-0">{docenteData.alumnos}</h2>
                  <small className="text-success fw-bold fs-7">
                    <i className="bi bi-arrow-up-short"></i> Activos
                  </small>
                </div>
                <div className="icon-circle bg-success bg-opacity-10">
                  <i className="bi bi-people-fill text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Encuestas */}
        <div className="col-xl-3 col-md-6">
          <div className="card stat-card h-100 shadow-sm border-warning">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="stat-label mb-1">Encuestas</p>
                  <h2 className="stat-value mb-0">{docenteData.encuestasFinalizadas}</h2>
                  <small className="text-muted fs-7">
                    {(docenteData.encuestasFinalizadas / docenteData.alumnos * 100).toFixed(0)}% completado
                  </small>
                </div>
                <div className="icon-circle bg-warning bg-opacity-10">
                  <i className="bi bi-clipboard-data-fill text-warning fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta 4: Evaluación */}
        <div className="col-xl-3 col-md-6">
          <div className="card stat-card h-100 shadow-sm border-info">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="stat-label mb-1">Promedio</p>
                  <h2 className="stat-value mb-0">{docenteData.evaluacionPromedio}</h2>
                  <small className="text-muted fs-7">Escala de 1 a 5</small>
                </div>
                <div className="icon-circle bg-info bg-opacity-10">
                  <i className="bi bi-star-fill text-info fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Informes */}
      <div className="row">
        <div className="col-lg-12 mb-4">
          <div className="card reports-card shadow-sm">
            <div className="card-header reports-header">
              <h5 className="card-title mb-0 d-flex align-items-center text-secondary">
                <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                Informes y Actividades Recientes
              </h5>
            </div>
            <div className="card-body p-0">
              {informes.length > 0 ? (
                <div className="list-group list-group-flush">
                  {informes.map((inf) => (
                    <div key={inf.id} className="list-group-item report-item px-4 py-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 fw-bold text-dark">{inf.codigo_actividad_curricular}</h6>
                        <small className="text-muted">
                          <i className="bi bi-person-circle me-1"></i>
                          {inf.docente_responsable}
                        </small>
                      </div>
                      <span className={`status-badge ${getStatusColor(inf.estado || 'default')}`}>
                        {inf.estado}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                    <i className="bi bi-inbox text-muted fs-1 mb-2"></i>
                    <p className="text-muted">No hay informes registrados.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-12 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="card-title mb-0">
                <i className="bi bi-journal-text me-2 text-primary"></i>
                Informes del Docente
              </h5>
            </div>
            <div className="card-body">
              {informes.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {informes.map((inf) => (
                    <li key={inf.id} className="list-group-item border-0 px-0 py-2">
                      <strong>{inf.codigo_actividad_curricular}</strong> —{" "}
                      {inf.docente_responsable} ({inf.estado})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No hay informes registrados.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelDocente;