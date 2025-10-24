import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface Opcion {
  id: number;
  contenido: string;
}

interface Pregunta {
  id: number;
  enunciado: string;
  categoria_id: number;
  encuesta_id: number;
  tipo: "cerrada" | "abierta";
}

interface Respuesta {
  id: number;
  pregunta_id: number;
  opcion_id: number[];
  texto_respuesta: string;
  encuesta_completada_id: number;
}

interface EncuestaCompletada {
  id: number;
  alumno_id: number;
  encuesta_id: number;
  materia_id: number;
  anio: number;
  periodo: string;
  respuestas: Respuesta[];
}

interface Materia {
  id: number;
  nombre: string;
  matricula: string;
}

export default function EncuestaCompletadaDetalle() {
  const { id } = useParams();
  const [encuesta, setEncuesta] = useState<EncuestaCompletada | null>(null);
  const [materia, setMateria] = useState<Materia | null>(null);
  const [preguntas, setPreguntas] = useState<Record<number, Pregunta>>({});
  const [opciones, setOpciones] = useState<Record<number, Opcion[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://127.0.0.1:8000/encuesta-completada/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener la encuesta completada");
        return res.json();
      })
      .then(async (data: EncuestaCompletada) => {
        setEncuesta(data);

        fetch(`http://127.0.0.1:8000/materias/${data.materia_id}`)
          .then((res) => res.json())
          .then((m: Materia) => setMateria(m))
          .catch(() => setMateria(null));

        const preguntasTemp: Record<number, Pregunta> = {};
        const opcionesTemp: Record<number, Opcion[]> = {};

        await Promise.all(
          data.respuestas.map(async (r) => {
            const pRes = await fetch(
              `http://127.0.0.1:8000/preguntas/${r.pregunta_id}`
            );
            if (pRes.ok) {
              const pregunta: Pregunta = await pRes.json();
              preguntasTemp[r.pregunta_id] = pregunta;

              if (pregunta.tipo === "cerrada") {
                const oRes = await fetch(
                  `http://127.0.0.1:8000/preguntas/${pregunta.id}/opciones`
                );
                if (oRes.ok) {
                  const ops: Opcion[] = await oRes.json();
                  opcionesTemp[pregunta.id] = ops;
                }
              }
            }
          })
        );

        setPreguntas(preguntasTemp);
        setOpciones(opcionesTemp);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar la encuesta completada");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="text-center mt-4">Cargando encuesta...</div>;

  if (error)
    return <div className="alert alert-danger text-center mt-4">{error}</div>;

  if (!encuesta)
    return (
      <div className="alert alert-warning text-center mt-4">
        No se encontró la encuesta completada
      </div>
    );

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h1 className="h4 mb-0">
            Materia: {materia ? materia.nombre : "Desconocida"}
          </h1>
        </div>

        <div className="card-body">
          <div className="alert alert-info">
            <strong>Año:</strong> {encuesta.anio}
            <br />
            <strong>Período:</strong> {encuesta.periodo}
          </div>

          <h5 className="mt-4">Respuestas</h5>

          {encuesta.respuestas.length > 0 ? (
            <ul className="list-group">
              {encuesta.respuestas.map((r) => {
                const pregunta = preguntas[r.pregunta_id];
                if (!pregunta) {
                  return (
                    <li key={r.id} className="list-group-item text-muted">
                      Pregunta no encontrada (ID {r.pregunta_id})
                    </li>
                  );
                }

                let respuestaTexto = "—";

                if (pregunta.tipo === "abierta") {
                  respuestaTexto = r.texto_respuesta || "—";
                } else if (pregunta.tipo === "cerrada") {
                  const opcionesDePregunta = opciones[pregunta.id] || [];
                  const opcionIds = Array.isArray(r.opcion_id)
                    ? r.opcion_id
                    : r.opcion_id != null
                    ? [r.opcion_id]
                    : [];

                  const seleccionadas = opcionesDePregunta.filter((op) =>
                    opcionIds.includes(op.id)
                  );

                  respuestaTexto =
                    seleccionadas.length > 0
                      ? seleccionadas.map((op) => op.contenido).join(", ")
                      : "—";
                }

                return (
                  <li key={r.id} className="list-group-item">
                    {pregunta.enunciado}
                    <br />
                    <span>
                      Respuesta: {respuestaTexto}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="alert alert-secondary mt-3">
              No hay respuestas registradas
            </div>
          )}

          <Link to="/encuestas-completadas" className="btn btn-secondary mt-4">
            Volver al listado
          </Link>
        </div>
      </div>
    </div>
  );
}