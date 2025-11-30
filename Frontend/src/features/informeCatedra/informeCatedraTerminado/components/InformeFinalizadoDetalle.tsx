import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { fetchInformeCatedraConPreguntas } from "../../services/informeCatedraServices";
import { getInformeFinalizadoDetalle } from "../../services/informeService";

import { Container, Card } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";

type TipoPregunta = "abierta" | "opcion_multiple" | "unica_opcion" | "booleana";

type Opcion = { id: number; texto: string };

type Pregunta = {
  id: number;
  texto: string;
  tipo: TipoPregunta;
  opciones: Opcion[];
};

type Categoria = {
  id: number;
  codigo: string;
  texto: string;
  preguntas: Pregunta[];
};

type RespuestaBackend = {
  id: number;
  pregunta_id: number;
  opcion_id: number | null;
  texto_respuesta: string | null;
};

export default function InformeCatedraVerDetalle() {
  const { finalizadoId, plantillaId } = useParams<{
    finalizadoId: string;
    plantillaId: string;
  }>();

  const navigate = useNavigate();

  const finalId = Number(finalizadoId);
  const baseId = Number(plantillaId);

  const [loading, setLoading] = useState(true);
  const [cabecera, setCabecera] = useState<any>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [respuestas, setRespuestas] = useState<RespuestaBackend[]>([]);
  const [preguntasHeader, setPreguntasHeader] = useState<Pregunta[]>([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        // 1) Detalle finalizado (respuestas)
        const detalle = await getInformeFinalizadoDetalle(finalId);
        if (!alive) return;

        setCabecera({
          asignatura: detalle.asignaturaNombre,
          codigo: detalle.asignaturaCodigo,
          anio: detalle.anio,
          docente: detalle.docenteResponsable,
          inscriptos: detalle.cantidadAlumnos,
        });

        setRespuestas(detalle.respuestas_informe ?? []);

        // 2) Plantilla con categorías y preguntas
        const catsRaw = await fetchInformeCatedraConPreguntas(baseId);
        if (!alive) return;

        const cats: Categoria[] = (catsRaw ?? [])
          .slice()
          .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
          .map((c) => ({
            ...c,
            preguntas: (c.preguntas ?? [])
              .slice()
              .sort((p1, p2) => (p1.id ?? 0) - (p2.id ?? 0)), // ← ORDEN POR ID
          }));

        setCategorias(cats);

        // 3 primeras preguntas (por ID)
        const todas = cats.flatMap((c) => c.preguntas);
        const primeras = todas.slice(0, 3);
        setPreguntasHeader(primeras);
      } finally {
        alive && setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [finalId, baseId]);

  // Buscar respuesta
  const buscarRespuesta = (p: Pregunta) => {
    const resps = respuestas.filter((r) => r.pregunta_id === p.id);

    if (resps.length === 0) return "—";

    if (p.tipo === "abierta") {
      return resps[0].texto_respuesta || "—";
    }

    if (p.tipo === "unica_opcion" || p.tipo === "booleana") {
      const op = p.opciones.find((o) => o.id === resps[0].opcion_id);
      return op?.texto || "—";
    }

    if (p.tipo === "opcion_multiple") {
      return resps
        .map((r) => p.opciones.find((o) => o.id === r.opcion_id)?.texto)
        .filter(Boolean)
        .join(", ");
    }

    return "—";
  };

  if (loading)
    return (
      <Container className="container py-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3">Cargando informe…</p>
      </Container>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      {/* HEADER */}
      <div
        className="py-3 mb-4 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderBottom: "4px solid #5a67d8",
        }}
      >
        <Container>
          <div className="d-flex align-items-center mb-1">
            <Link to="/docente" className="btn btn-outline-light btn-sm me-3">
              <ArrowLeft size={24} />
              <span className="ms-2">Volver</span>
            </Link>

            <div>
              <h4 className="mb-0 text-white d-flex align-items-center">
                <i className="bi bi-mortarboard-fill me-2"></i>
                Informe Finalizado
              </h4>
              <p style={{ color: "rgba(255,255,255,0.8)" }}>
                {cabecera.asignatura} · Ciclo {cabecera.anio}
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* CONTENIDO */}
      <div className="container pb-5">
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          {/* CABECERA */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-light border-bottom">
              <strong>Datos generales</strong>
            </Card.Header>

            <Card.Body className="p-0">
              <table className="table table-sm table-bordered mb-0">
                <tbody>
                  <tr>
                    <th>Actividad</th>
                    <td>{cabecera.asignatura}</td>
                  </tr>
                  <tr>
                    <th>Código</th>
                    <td>{cabecera.codigo}</td>
                  </tr>
                  <tr>
                    <th>Ciclo lectivo</th>
                    <td>{cabecera.anio}</td>
                  </tr>
                  <tr>
                    <th>Docente responsable</th>
                    <td>{cabecera.docente}</td>
                  </tr>

                  {/* PRIMERAS PREGUNTAS */}
                  {preguntasHeader.map((p) => (
                    <tr key={p.id}>
                      <th>{p.texto}</th>
                      <td>{buscarRespuesta(p)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card.Body>
          </Card>

          {/* CATEGORÍAS */}
          {categorias
            .filter((c) => c.id !== categorias[0]?.id)
            .map((cat) => (
              <Card className="shadow-sm mb-4" key={cat.id}>
                <Card.Header
                  className="p-4"
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <h5 className="mb-0 text-white">
                    <span className="badge bg-light text-primary me-2">
                      {cat.codigo}
                    </span>
                    {cat.texto}
                  </h5>
                </Card.Header>

                <div className="card-body" style={{ backgroundColor: "#f9fafb" }}>
                  <ol className="mb-0 ps-3">
                    {cat.preguntas.map((p) => (
                      <li key={p.id} className="mb-3">
                        <div className="fw-semibold">{p.texto}</div>
                        <div className="text-muted mt-1">
                          {buscarRespuesta(p)}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </Card>
            ))}

          <div className="d-flex justify-content-end">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/docente")}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
