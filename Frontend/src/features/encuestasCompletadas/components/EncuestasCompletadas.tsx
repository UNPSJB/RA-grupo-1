import { useState, useEffect } from "react";
import type { Asignatura } from "../../../asignaturas/types/asignaturaTypes";
import { Link } from "react-router-dom";
import ROUTES from "../../paths";

type Respuesta = {
  id: number;
  pregunta_id: number;
  opcion_id: number[];
  texto_respuesta: string;
  encuesta_completada_id: number;
};

type EncuestaFinalizada = {
  id: number;
  alumno_id: number;
  encuesta_id: number;
  asignatura_id: number;
  anio: number;
  duracion: string;
  respuestas: Respuesta[];
};

type Props = {
  encuestas: EncuestaFinalizada[];
};

export default function EncuestasCompletadas({ encuestas }: Props) {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/asignaturas`)
      .then((res) => res.json())
      .then((data: Asignatura[]) => setAsignaturas(data))
      .catch((err) => {
        console.error("Error al obtener las asignaturas:", err);
        setAsignaturas([]);
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
                  {asignaturas.find((m) => m.id === e.asignatura_id)?.nombre ||
                    "La asignatura no existe"}
                </span>

                <span className="text-dark">
                  {" "}
                  — {e.anio} {e.duracion}
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