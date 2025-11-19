import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cursado } from "../hooks/useEncuestas";
import NotificacionExito from "../../pregunta/components/NotificacionExito";

type EncuestaHabilitada = {
  asignatura: string;
  encuesta: string;
  asignatura_id: number;
  encuesta_id: number;
};

type Props = {
  encuestas: EncuestaHabilitada[];
  alumnoId: number;
};

export default function EncuestasHabilitadas({ encuestas, alumnoId }: Props) {
  const navigate = useNavigate();
  const [notificacionExito, setNotificacionExito] = useState<string | null>(null); 

  const verificar_Completar = async (e: EncuestaHabilitada) => {
    try {
      const params = new URLSearchParams({
        alumno_id: alumnoId.toString(),
        encuesta_id: e.encuesta_id.toString(),
        asignatura_id: e.asignatura_id.toString(),
        anio: Cursado.AnioActual.toString(),
        periodo: 'cuatrimestre 1'
      });

      const response = await fetch(`http://localhost:8000/encuesta-completada/existe?${params}`);
      const data = await response.json();

      if(data.existe){
        setNotificacionExito(`La encuesta ya esta completada ${e.asignatura}`); 
      } else{
        navigate("/encuestas/categoria-b", {
          state: {
            alumnoId: alumnoId,
            encuestaId: e.encuesta_id,
            asignaturaId: e.asignatura_id,
            nombreAsignatura: e.asignatura
          }
        });
      }
    } catch (error) {
      console.error("Ocurrio un error cuando se quiso verificar la encuesta:", error);
      setNotificacionExito("Error cuando se verifico la encuesta");  
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
        No existen carreras habilitadas
      </div>
    );
  }

  return (
    <div className="list-group">
      {encuestas.map((e, i) => (
        <div key={i} className="col-12 mb-3">
          <div className="card">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted me-3">{i + 1}.</span>
                <span className="fw-bold">
                  <strong>{e.asignatura}</strong> — {e.encuesta}{" "}
                </span>
              </div>
              <button onClick={() => verificar_Completar(e)}
                className="btn btn-primary btn-sm"
              >
                Completar Encuesta
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}