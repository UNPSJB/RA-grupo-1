// features/encuestas/EncuestaHabilitada.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cursado } from "../hooks/useEncuestas";
import NotificacionExito from "../../pregunta/components/NotificacionExito";

type EncuestaHabilitada = {
  asignatura: string;
  encuesta: string;
  asignatura_id: number;
  encuesta_id: number;
  fecha_cierre: string; 
};

type Props = {
  encuestas: EncuestaHabilitada[];
  alumnoId: number;
};

export default function EncuestasHabilitadas({ encuestas, alumnoId }: Props) {
  const navigate = useNavigate();
  const [notificacionExito, setNotificacionExito] = useState<string | null>(null);
  const [procesando, setProcesando] = useState<number | null>(null);

  const verificarYCompletar = async (encuesta: EncuestaHabilitada, index: number) => {
    try {
      setProcesando(index);
      
      const params = new URLSearchParams({
        alumno_id: alumnoId.toString(),
        encuesta_id: encuesta.encuesta_id.toString(),
        asignatura_id: encuesta.asignatura_id.toString(),
        anio: Cursado.AnioActual.toString(),
        duracion: 'cuatrimestre 1'
      });

      const response = await fetch(`http://localhost:8000/encuesta-completada/existe?${params}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status} al verificar encuesta`);
      }
      
      const data = await response.json();

      if (data.existe) {
        setNotificacionExito(`La encuesta de ${encuesta.asignatura} ya está completada.`); 
      } else {
        // Verificar si está vencida
        const ahora = new Date();
        const cierre = new Date(encuesta.fecha_cierre);
        
        if (ahora > cierre) {
          setNotificacionExito(`La encuesta de ${encuesta.asignatura} ya ha vencido.`);
          return;
        }

        // Navegar a la encuesta correspondiente según el tipo
        if (encuesta.encuesta.includes("Ciclo Básico")) {
          navigate("/encuestas/categoria-b", {
            state: {
              alumnoId: alumnoId,
              encuestaId: encuesta.encuesta_id,
              asignaturaId: encuesta.asignatura_id,
              nombreAsignatura: encuesta.asignatura,
              fechaCierre: encuesta.fecha_cierre 
            }
          });
        } else {
          navigate(`/encuestas/completar/${encuesta.encuesta_id}`, {
            state: {
              alumnoId: alumnoId,
              asignaturaId: encuesta.asignatura_id,
              nombreAsignatura: encuesta.asignatura,
              fechaCierre: encuesta.fecha_cierre 
            }
          });
        }
      }
    } catch (error) {
      console.error("Ocurrió un error al verificar la encuesta:", error);
      setNotificacionExito("Error al verificar el estado de la encuesta. Intenta nuevamente.");  
    } finally {
      setProcesando(null);
    }
  };

  const cerrarNotificacion = () => {
    setNotificacionExito(null);
  };

  if (notificacionExito) {
    return (
      <NotificacionExito
        notificacion={notificacionExito}
        onClose={cerrarNotificacion}
      />
    );
  } 

  if (encuestas.length === 0) {
    return (
      <div className="alert alert-info text-center">
        <i className="bi bi-inbox me-2"></i>
        No hay encuestas habilitadas en este momento.
      </div>
    );
  }

  return (
    <div className="row">
      {encuestas.map((encuesta, index) => (
        <div key={index} className="col-12 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-7">
                  <div className="d-flex align-items-start mb-2">
                    <span className="badge bg-primary rounded-circle me-3 mt-1" 
                          style={{ width: "32px", height: "32px", lineHeight: "32px" }}>
                      {index + 1}
                    </span>
                    <div>
                      <h6 className="card-title mb-1 text-primary">
                        {encuesta.asignatura}
                      </h6>
                      <p className="card-text text-muted mb-2 small">
                        <i className="bi bi-clipboard me-1"></i>
                        {encuesta.encuesta}
                      </p>
                        
                      <div className="mt-2">
                        <small className="text-muted">
                          <i className="bi bi-hash me-1"></i>
                          Asignatura ID: {encuesta.asignatura_id} • 
                          Encuesta ID: {encuesta.encuesta_id}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-5 text-end">
                  <button 
                    onClick={() => verificarYCompletar(encuesta, index)}
                    className="btn btn-primary"
                    disabled={procesando === index}
                  >
                    {procesando === index ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Verificando...</span>
                        </span>
                        Verificando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-pencil me-2"></i>
                        Completar Encuesta
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}