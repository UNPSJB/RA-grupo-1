import { useState, useEffect } from "react";
import EncuestasFinalizadas from "./EncuestasFinalizadas";

type Respuesta = {
  id: number;
  pregunta_id: number;
  opcion_id: number[];
  texto_respuesta: string;
  encuesta_finalizada_id: number;
}

type EncuestaFinalizada = {
  id: number;
  alumno_id: number;
  encuesta_id: number;
  asignatura_id: number;
  anio: number;
  duracion: string;
  respuestas: Respuesta[];
};

export default function EncuestasFinalizadasPage() {
  const alumnoId = 3; 
  const [encuestas, setEncuestas] = useState<EncuestaFinalizada[]>([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/encuesta-finalizada/alumno/${alumnoId}`)
      .then((res) => res.json())
      .then((data: EncuestaFinalizada[]) => setEncuestas(data))
      .catch((err) => {
        console.error("Error al obtener encuestas:", err);
        setEncuestas([]);
      });
  }, [alumnoId]);

  return (
    <div className="container py-4">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h1 className="h4 mb-0">Alumno {alumnoId}</h1>
          </div>
          <div className="card-body">
            <h2 className="h5 mb-3">Encuestas finalizadas:</h2>
            <EncuestasFinalizadas
              encuestas={encuestas}
              />
          </div>
        </div>
      </div>
  );

}