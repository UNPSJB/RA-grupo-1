import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";

interface Respuesta {
  id: number;
  pregunta_id: number;
  opcion_id: number | null;
  respuesta_texto?: string;
  pregunta_texto: string;
  opciones?: { id: number; contenido: string }[];
}

export default function VerEncuestaCompleta() {
  const { idEncuesta, idAlumno } = useParams();
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);

  useEffect(() => {
    api
      .get(`/respuestas/${idEncuesta}/${idAlumno}`)
      .then((res) => setRespuestas(res.data))
      .catch(() => console.error("Error obteniendo respuestas de encuesta finalizada."));
  }, [idEncuesta, idAlumno]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Respuestas Registradas</h2>

      {respuestas.length === 0 ? (
        <div className="alert alert-info">No se encontraron respuestas para esta encuesta.</div>
      ) : (
        respuestas.map((r) => (
          <div key={r.id} className="card mb-3 p-3">
            <p className="fw-bold">{r.pregunta_texto}</p>

            {/* Pregunta abierta (texto libre) */}
            {r.respuesta_texto !== null && r.respuesta_texto !== "" && (
              <input
                type="text"
                value={r.respuesta_texto}
                readOnly
                disabled
                className="form-control"
              />
            )}

            {/* Pregunta cerrada (opción seleccionada) */}
            {r.opcion_id !== null && (
              <div>
                <input
                  type="radio"
                  checked={true}
                  disabled
                  className="form-check-input me-2"
                />
                <label className="form-check-label">
                  {r.opciones?.find((o) => o.id === r.opcion_id)?.contenido ?? "Opción seleccionada"}
                </label>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
export default VerEncuestaCompleta;
