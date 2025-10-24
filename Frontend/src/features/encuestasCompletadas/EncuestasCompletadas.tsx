import { useState, useEffect } from "react";
import type { Materia } from "../../types/types";
import { Link } from "react-router-dom";

type Respuesta = {
  id: number;
  pregunta_id: number;
  opcion_id: number[];
  texto_respuesta: string;
  encuesta_completada_id: number;
};

type EncuestaCompletada = {
  id: number;
  alumno_id: number;
  encuesta_id: number;
  materia_id: number;
  anio: number;
  periodo: string;
  respuestas: Respuesta[];
};

type Props = {
  encuestas: EncuestaCompletada[];
};

export default function EncuestasCompletadas({ encuestas }: Props) {
  const [materias, setMaterias] = useState<Materia[]>([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/materias`)
      .then((res) => res.json())
      .then((data: Materia[]) => setMaterias(data))
      .catch((err) => {
        console.error("Error al obtener materias:", err);
        setMaterias([]);
      });
  }, [encuestas]);

  if (encuestas.length === 0) {
    return (
      <div className="alert alert-info text-center">
        No hay carreras disponibles
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
                <span className="text-muted me-2">{i + 1}.</span>
                <span className="fw-bold">
                  {materias.find((m) => m.id === e.materia_id)?.nombre ||
                    "Materia desconocida"}
                </span>

                <span className="text-dark">
                  {" "}
                  — {e.anio} {e.periodo}
                </span>
              </div>
              <Link
                to={`/encuestas-completadas/${e.id}`}
                className="btn btn-primary btn-sm"
              >
                Ver encuesta
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}