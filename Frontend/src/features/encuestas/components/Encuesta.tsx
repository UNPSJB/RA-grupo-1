import { useState, useEffect } from "react";
import EncuestaHabilitada from "./EncuestaHabilitada";

type EncuestaHabilitada = {
  asignatura: string;
  encuesta: string;
  asignatura_id: number;
  encuesta_id: number;
};

export default function EncuestasPage() {
  const alumnoId = 3; // hardcodeado conectar con la API
  const [encuestas, setEncuestas] = useState<EncuestaHabilitada[]>([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/alumnos/${alumnoId}/encuestas_disponibles`)
      .then((res) => res.json())
      .then((data: EncuestaHabilitada[]) => setEncuestas(data))
      .catch((err) => {
        console.error("Hubo un error al obtener las encuestas:", err);
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
            <h2 className="h5 mb-3">Encuestas habilitadas:</h2>
            <EncuestaHabilitada
              encuestas={encuestas}
              alumnoId={alumnoId} 
              />
          </div>
        </div>
      </div>
  );

}