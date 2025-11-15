import { useState, useEffect } from "react";
import EncuestasDisponibles from "./EncuestasDisponibles";
import { useContadorEncuestas } from "../hooks/useContadorEncuestas";

type EncuestaDisponibleType = {
  asignatura: string;
  encuesta: string;
  asignatura_id: number;
  encuesta_id: number;
  fecha_cierre: string;
};

export default function Encuesta() {
  const alumnoId = 3;
  const [encuestas, setEncuestas] = useState<EncuestaDisponibleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const encuestasConTiempo = useContadorEncuestas(encuestas);

  useEffect(() => {
    const cargarEncuestas = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/alumnos/${alumnoId}/encuestas_disponibles`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data: EncuestaDisponibleTypeType[] = await response.json();
        
        const encuestasConFechas = data.map((encuesta, index) => ({
          ...encuesta,
          fecha_cierre: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString() 
        }));
        
        setEncuestas(encuestasConFechas);
        setError(null);
      } catch (err) {
        console.error("Hubo un error al obtener las encuestas:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
        setEncuestas([]);
      } finally {
        setLoading(false);
      }
    };

    cargarEncuestas();
  }, [alumnoId]);

  if (loading) {
    return (
      <div className="container py-4">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <h5>Cargando encuestas disponibles...</h5>
            <p className="text-muted">Por favor espera un momento.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h4 mb-0">
                <i className="bi bi-clipboard-check me-2"></i>
                Encuestas Disponibles
              </h1>
              <small className="opacity-75">Alumno ID: {alumnoId}</small>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-light text-dark fs-6">
                {encuestas.length} encuesta{encuestas.length !== 1 ? 's' : ''}
              </span>
              
              {encuestas.length > 0 && (
                <ContadorTiempo
                  fechaCierre={encuestas[0].fecha_cierre}
                  formato="corto"
                  mostrarTooltip={true}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="card-body">
          {error ? (
            <div className="alert alert-danger">
              <h5 className="alert-heading">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Error al cargar encuestas
              </h5>
              <p className="mb-0">{error}</p>
              <button 
                className="btn btn-outline-danger btn-sm mt-2"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h5 className="text-primary mb-3">
                  <i className="bi bi-list-check me-2"></i>
                  Encuestas disponibles para completar:
                </h5>
                <p className="text-muted">
                  Selecciona una encuesta para comenzar a completarla. 
                  <strong> Presta atención a los tiempos de cierre.</strong>
                </p>
              </div>
              
              <EncuestasDisponibles
                encuestas={encuestasConTiempo}
                alumnoId={alumnoId} 
              />
            </>
          )}
        </div>
        
        <div className="card-footer bg-light">
          <div className="row">
            <div className="col-md-6">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Las encuestas están disponibles según tu plan de estudios y período académico.
              </small>
            </div>
            <div className="col-md-6 text-end">
              <small className="text-muted">
                <i className="bi bi-clock me-1"></i>
                Tiempos actualizados en tiempo real
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}