import { useState, useEffect } from "react";
import EncuestasCompletadas from "./EncuestasCompletadas";

type Respuesta = {
  id: number;
  pregunta_id: number;
  opcion_id: number[];
  texto_respuesta: string;
  encuesta_completada_id: number;
}

type EncuestaCompletada = {
  id: number;
  alumno_id: number;
  encuesta_id: number;
  asignatura_id: number;
  anio: number;
  periodo: string;
  respuestas: Respuesta[];
};

export default function EncuestasCompletadasPage() {
  const alumnoId = 3; // HARCODEADO ACA VAN LOS DATOS DE LA API
  const [encuestas, setEncuestas] = useState<EncuestaCompletada[]>([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/encuesta-completada/alumno/${alumnoId}`)
      .then((res) => res.json())
      .then((data: EncuestaCompletada[]) => setEncuestas(data))
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
            <h2 className="h5 mb-3">Encuestas completadas:</h2>
            <EncuestasCompletadas
              encuestas={encuestas}
              />
          </div>
        </div>
      </div>
  );

}