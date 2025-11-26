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