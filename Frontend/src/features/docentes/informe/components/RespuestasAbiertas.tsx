import { useEffect, useState, Fragment } from "react";
import { ANIO_ACTUAL, DURACION_ACTUAL } from "../../../../constants";

interface DatosAbiertosPregunta {
  id_pregunta: number;
  enunciado: string;
  respuestas: string[];
}

interface DatosAbiertosCategoria {
  categoria_cod: string;
  categoria_texto: string;
  preguntas: DatosAbiertosPregunta[];
}

interface RelacionDocenteasignaturas {
  docente_id: number;
  asignaturas_id: number;
  anio: number | null;
  duracion: string | number | null;
}

interface Props {
  docenteasignaturasId: number;
}

export default function RespuestasAbiertas({ docenteasignaturasId }: Props) {
  const [categorias, setCategorias] = useState<DatosAbiertosCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true);
      setError(null);
      try {
        const relacionRes = await fetch(
          `http://127.0.0.1:8000/docentes/asignaturas_relacion/${docenteasignaturasId}`
        );
        if (!relacionRes.ok)
          throw new Error("Error al obtener la relación docente-asignaturas");

        const relacion: RelacionDocenteasignaturas = await relacionRes.json();
        const asignaturasId = relacion.asignaturas_id;
        const anio = relacion.anio ?? ANIO_ACTUAL;
        const duracion = relacion.duracion ?? duracion_ACTUAL;

        const respuestasRes = await fetch(
          `http://127.0.0.1:8000/datos_estadisticos/respuestas_abiertas?id_asignaturas=${asignaturasId}&anio=${anio}&duracion=${duracion}`
        );
        if (!respuestasRes.ok)
          throw new Error("Error al obtener respuestas abiertas");

        const data: DatosAbiertosCategoria[] = await respuestasRes.json();
        setCategorias(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocurrió un error inesperado"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [docenteasignaturasId]);

  if (loading) return <p>Cargando respuestas abiertas...</p>;

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  if (
    !categorias.length ||
    categorias.every((cat) => cat.preguntas.length === 0)
  )
    return (
      <p className="text-muted">
        No se registran respuestas de retroalimentación.
      </p>
    );

  return (
    <Fragment>
      <h5 className="text-dark fw-bold mb-3 mt-4">
        Opiniones de los estudiantes sobre la asignaturas
      </h5>
      <hr className="mb-4" />

      <div
        className="accordion accordion-flush"
        id={`accordionRespuestasAbiertas-${docenteasignaturasId}`}
      >
        {categorias.map((cat, catIndex) => (
          <Fragment key={cat.categoria_cod}>
            {cat.preguntas.map((pregunta, pregIndex) => (
              <div className="accordion-item" key={pregunta.id_pregunta}>
                <h2
                  className="accordion-header"
                  id={`heading-${catIndex}-${pregIndex}`}
                >
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${catIndex}-${pregIndex}`}
                    aria-expanded="false"
                    aria-controls={`collapse-${catIndex}-${pregIndex}`}
                  >
                    {pregunta.enunciado}
                  </button>
                </h2>
                <div
                  id={`collapse-${catIndex}-${pregIndex}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading-${catIndex}-${pregIndex}`}
                  data-bs-parent={`#accordionRespuestasAbiertas-${docenteasignaturasId}`}
                >
                  <div className="accordion-body">
                    {pregunta.respuestas.length > 0 ? (
                      <ul className="list-group list-group-flush">
                        {pregunta.respuestas.map((texto, i) => (
                          <li
                            key={i}
                            className="list-group-item py-2 px-0"
                          >
                            {texto || (
                              <span className="text-muted fst-italic">
                                Sin respuesta
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted small fst-italic mb-0">
                        Sin respuestas registradas para esta pregunta.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </Fragment>
  );
}