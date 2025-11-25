import React, { useEffect, useState } from 'react';
import { getDocenteById, Docente, docenteService, DocenteStats } from '../services/docenteService'; 
import { getInformesPendientesCabecera, InformePendienteCabecera } from "../services/informeService";
import '../styles/PanelDocente.css'; 
import { Link } from 'react-router-dom';

export const DocenteId: number = 1; // Simulación de ID de docente logueado

export const PanelDocente: React.FC = () => {
  // DATOS HARCODEADOS (Idealmente vendrían de una API)

  const [pendientes, setPendientes] = useState<InformePendienteCabecera[]>([]);
  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const data = await getInformesPendientesCabecera(DocenteId);
        setPendientes(data);
      } catch (error) {
        console.error("Error al obtener informes pendientes:", error);
      }
    };

    fetchPendientes();
  }, []);


  const [docente, setDocente] = useState<Docente | null>(null);
  useEffect(() => {
    const fetchDocente = async () => {
      try {
        const data = await getDocenteById(DocenteId);
        setDocente(data);
      } catch (error) {
        console.error("Error al obtener datos del docente:", error);
      }
    };
    fetchDocente();
  }, []); 

  const docenteData = {
    asignaturas: 3,
    semestre: "2025",
    alumnos: 105,
    encuestasFinalizadas: 85,
    evaluacionPromedio: 3.7
  };

  const getStatusColor = (estado: string) => {
    switch(estado.toLowerCase()) {
      case 'aprobado': return 'bg-success bg-opacity-10 text-success';
      case 'pendiente': return 'bg-warning bg-opacity-10 text-warning';
      default: return 'bg-secondary bg-opacity-10 text-secondary';
    }
  };

   return (
    <div className="container-fluid py-4">
      {/* Sección de Bienvenida Rápida */}
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
      <div className="col-lg-12 mb-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-header bg-white border-0">
            <h5 className="card-title mb-0">
              <i className="bi bi-journal-text me-2 text-primary"></i>
              Informes Pendientes
            </h5>
          </div>

          <div className="card-body">
            {pendientes.length > 0 ? (
              <ul className="list-group list-group-flush">
                {pendientes.map((inf) => (
                  <li
                    key={inf.id}
                    className="list-group-item border-0 px-0 py-3 d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong className="text-dark">
                        {inf.titulo || "Sin título"}
                      </strong>
                      <br />
                      <small className="text-muted">
                        <i className="bi bi-book me-1"></i>
                        {inf.asignaturaNombre} ({inf.asignaturaCodigo})
                      </small>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <span className="badge bg-warning text-dark px-3 py-2">
                        Pendiente
                      </span>

                      <Link
                        to={`/docente/informes-catedra/completar/${inf.id}/${inf.informe_catedra_id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="Completar informe"
                      >
                          Completar
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No hay informes pendientes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelDocente;