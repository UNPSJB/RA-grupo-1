import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchInformeCatedraConPreguntas,} from "../services/informeCatedraServices";
import { guardarBorradorInforme, finalizarInforme, getInformeById } from "../services/informeService";
import { Container, Card, Button, Form, Alert, Badge, Row, Col, ProgressBar as BSProgressBar } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';


type TipoPregunta = "abierta" | "opcion_multiple" | "unica_opcion" | "booleana";
type Opcion = { 
  id: number; 
  texto: string 
};
type Pregunta = {
  id: number;
  texto: string;
  tipo: TipoPregunta;
  nro_pregunta: number;
  opciones: Opcion[];
};
type Categoria = {
  id: number;
  codigo: string;
  texto: string;
  preguntas: Pregunta[];
};
type InformeCabecera = {
  id: number;
  titulo: string;
  anio: number;
  cantidadAlumnos: number;
  asignaturaNombre: string;
  asignaturaCodigo: string;
  docenteResponsable: string;
};
type Respuesta = {
  preguntaId: number;
  opcionSeleccionada?: string;
  textoRespuesta?: string;
  subrespuestas?: Map<string, string>;  
};
type RespuestaLocal =
  | { tipo: "abierta"; texto: string }
  | { tipo: "unica_opcion" | "booleana"; opcionId: number | null }
  | { tipo: "opcion_multiple"; opcionIds: number[] };

const convertirRespuestasParaBackend = (
  respuestas: Record<number, RespuestaLocal>
) => {
  const resultado: any[] = [];

  for (const [preguntaId, r] of Object.entries(respuestas)) {
    const pid = Number(preguntaId);

    if (r.tipo === "abierta") {
      resultado.push({
        pregunta_id: pid,
        texto_respuesta: r.texto || null,
        opcion_id: null,
      });
      continue;
    }

    if (r.tipo === "unica_opcion" || r.tipo === "booleana") {
      resultado.push({
        pregunta_id: pid,
        opcion_id: r.opcionId,
        texto_respuesta: null,
      });
      continue;
    }

    if (r.tipo === "opcion_multiple") {
      for (const opcionId of r.opcionIds) {
        resultado.push({
          pregunta_id: pid,
          opcion_id: opcionId,
          texto_respuesta: null,
        });
      }
      continue;
    }
  }

  return resultado;
};
export default function InformeCatedraDetalle() {
  const { finalizadoId, plantillaId } = useParams<{
    finalizadoId: string;
    plantillaId: string;
  }>();
  const navigate = useNavigate();
  const finalId = Number(finalizadoId);
  const baseId = Number(plantillaId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cabecera, setCabecera] = useState<InformeCabecera | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [respuestas, setRespuestas] = useState<Record<number, RespuestaLocal>>({});

  const [categoriaIndex, setCategoriaIndex] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError(null);
        setLoading(true);

        const [cab, catsRaw] = await Promise.all([
          getInformeById(finalId),          // trae cabecera del INF FINALIZADO
          fetchInformeCatedraConPreguntas(baseId), // trae la PLANTILLA con preguntas
        ]);

        if (!alive) return;

        setCabecera(cab);

        const cats: Categoria[] = (catsRaw ?? [])
          .slice()
          .sort((a: Categoria, b: Categoria) => (a.id ?? 0) - (b.id ?? 0))
          .map((c: Categoria) => ({
            ...c,
            preguntas: (c.preguntas ?? [])
              .slice()
              .sort((p1, p2) => (p1.nro_pregunta ?? 0) - (p2.nro_pregunta ?? 0)
              ),
          }));

        setCategorias(cats);
        setCategoriaIndex(0);
        
      } catch (e: any) {
        setError(e?.message ?? "No se pudo cargar el informe");
      } finally {
        alive && setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [finalId, baseId]);

  const setAbierta = (preguntaId: number, texto: string) =>
    setRespuestas((r) => ({ ...r, [preguntaId]: { tipo: "abierta", texto } }));

  const toggleMultiple = (preguntaId: number, opcionId: number) =>
    setRespuestas((r) => {
      const prev = r[preguntaId];
      const actuales =
        prev && prev.tipo === "opcion_multiple" ? [...prev.opcionIds] : [];
      const i = actuales.indexOf(opcionId);
      i >= 0 ? actuales.splice(i, 1) : actuales.push(opcionId);
      return {
        ...r,
        [preguntaId]: { tipo: "opcion_multiple", opcionIds: actuales },
      };
    });

  const setUnica = (preguntaId: number, opcionId: number) =>
    setRespuestas((r) => ({
      ...r,
      [preguntaId]: { tipo: "unica_opcion", opcionId },
    }));

  const setBooleana = (preguntaId: number, opcionId: number) =>
    setRespuestas((r) => ({
      ...r,
      [preguntaId]: { tipo: "booleana", opcionId },
    }));


  if (loading)
    return (
      <Container className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Cargando informe de cátedra…</p>
      </Container>
    );
  if (error)
    return (
      <div className="container py-4 text-danger">
        Error: {error}
      </div>
    );
  if (!cabecera) return null;

  const todasOrdenadas: Pregunta[] = categorias.flatMap((c) => c.preguntas);
  const preguntasHeader = todasOrdenadas.filter((p) =>[1, 2].includes(Number(p.nro_pregunta)));
  const headerIds = new Set(preguntasHeader.map((q) => q.id));

  const totalCategorias = categorias.length;
  const categoriaActual = categorias[categoriaIndex];
  const progreso = totalCategorias > 0 ? Math.round(((categoriaIndex + 1) / totalCategorias) * 100): 0;

  const renderControl = (p: Pregunta) => {
    const r = respuestas[p.id];

    if (p.tipo === "abierta") {
      return (
        <textarea
          className="form-control"
          rows={3}
          value={(r && r.tipo === "abierta" && r.texto) || ""}
          onChange={(e) => setAbierta(p.id, e.target.value)}
          placeholder="Escriba su respuesta"
        />
      );
    }

    if (p.tipo === "unica_opcion") {
      return (
        <div className="form-check-group">
          {(p.opciones ?? []).map((op) => (
            <div key={op.id} className="form-check mb-1">
              <input
                className="form-check-input"
                type="radio"
                name={`p-${p.id}`}
                checked={
                  !!(r && r.tipo === "unica_opcion" && r.opcionId === op.id)
                }
                onChange={() => setUnica(p.id, op.id)}
                id={`p-${p.id}-op-${op.id}`}
              />
              <label
                htmlFor={`p-${p.id}-op-${op.id}`}
                className="form-check-label"
              >
                {op.texto}
              </label>
            </div>
          ))}
        </div>
      );
    }

    if (p.tipo === "booleana") {
      return (
        <div className="form-check-group">
          {(p.opciones ?? []).map((op) => (
            <div key={op.id} className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name={`p-${p.id}`}
                checked={!!(r && r.tipo === "booleana" && r.opcionId === op.id)}
                onChange={() => setBooleana(p.id, op.id)}
                id={`p-${p.id}-op-${op.id}`}
              />
              <label
                htmlFor={`p-${p.id}-op-${op.id}`}
                className="form-check-label"
              >
                {op.texto}
              </label>
            </div>
          ))}
        </div>
      );
    }

    // opcion_multiple
    return (
      <div className="form-check-group">
        {(p.opciones ?? []).map((op) => {
          const checked =
            r &&
            r.tipo === "opcion_multiple" &&
            (r.opcionIds || []).includes(op.id);
          return (
            <div key={op.id} className="form-check mb-1">
              <input
                className="form-check-input"
                type="checkbox"
                checked={!!checked}
                onChange={() => toggleMultiple(p.id, op.id)}
                id={`p-${p.id}-op-${op.id}`}
              />
              <label
                htmlFor={`p-${p.id}-op-${op.id}`}
                className="form-check-label"
              >
                {op.texto}
              </label>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      {/* HEADER SUPERIOR */}
      <div
        className="py-3 mb-4 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderBottom: '4px solid #5a67d8',
        }}
      >
        <Container>      
            <div className="d-flex align-items-center mb-1">
              <Link
                to="/docente"
                className="btn btn-outline-light btn-sm me-3"
              >
                <ArrowLeft size={24} />
                <span className="ms-2">Volver</span>
              </Link>
              <div className="flew-grow-1">
                <h4 className="mb-0 text-white d-flex align-items-center">
                  <i className="bi bi-mortarboard-fill me-2"></i>
                  Informe de Actividad Curricular
                </h4>
                <p style={{ color: "rgba(255,255,255,0.8)" }}>
                  {cabecera.asignaturaNombre} · Ciclo {cabecera.anio}
                </p>
              </div>
            </div>

            {/* Barra de progreso + datos de la asignatura */}
            {totalCategorias > 0 && (
              <div style={{ minWidth: 260 }}>
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-white">
                    Progreso de la encuesta
                  </small>
                  <small className="text-white">
                    Sección {categoriaIndex + 1} de {totalCategorias}
                  </small>
                </div>
                <BSProgressBar 
                  now={progreso} 
                  style={{height: '8px', backgroundColor: 'rgba(255,255,255,0.3)'}}
                  className="rounded"
                />
              </div>
            )}          
        </Container>
      </div>

      {/* CONTENIDO */}
      <div className="container pb-5">
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          {/* CUADRO CABECERA SOLO EN LA PRIMERA SECCIÓN */}
          {categoriaIndex === 0 && (
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light border-bottom">
                <strong>Datos generales de la actividad</strong>
              </div>
              
              <div className="card-body p-0">
                <table className="table table-sm table-bordered mb-0">
                  <tbody>

                    <tr>
                      <th style={{ width: 280 }}>Sede</th>
                      <td>{"Trelew"}</td>
                    </tr>
                    <tr>
                      <th>Ciclo lectivo</th>
                      <td>{cabecera.anio}</td>
                    </tr>
                    <tr>
                      <th>Actividad curricular</th>
                      <td>{cabecera.asignaturaNombre}</td>
                    </tr>
                    <tr>
                      <th>Código de la actividad curricular</th>
                      <td>{cabecera.asignaturaCodigo}</td>
                    </tr>
                    <tr>
                      <th>Docente responsable</th>
                      <td>{cabecera.docenteResponsable}</td>
                    </tr>

                    {/* 3 primeras preguntas en el cuadro */}
                    {preguntasHeader.map((p) => (
                    <tr key={p.id}>
                      <th>{p.texto}</th>
                      <td>{renderControl(p)}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORÍAS PAGINADAS EN TARJETAS PEQUEÑAS */}
          {categoriaIndex !== 0 && categoriaActual && (
            <Card className="shadow-sm mb-4">
              <Card.Header
                className="p-4"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'none',
                }}
              >
                <div className="d-flex align-items-center">
                  <h5>
                    <span className="badge bg-light text-primary me-2">
                      {categoriaActual.codigo}
                    </span>
                    <strong className="mb-0 text-white">{categoriaActual.texto}</strong>
                  </h5>
                </div>
              </Card.Header>
              <div
                className="card-body"
                style={{ backgroundColor: "#f9fafb" }}
              >
                {(() => {
                  const preguntasResto = (categoriaActual.preguntas ?? []).filter(
                    (p) => !headerIds.has(p.id)
                  );

                  if (preguntasResto.length === 0) {
                    return (
                      <p className="text-muted mb-0">
                        Esta categoría no tiene preguntas adicionales.
                      </p>
                    );
                  }

                  return (
                    <ol className="mb-0 ps-3">
                      {preguntasResto.map((p) => (
                        <li key={p.nro_pregunta} className="mb-3">
                          <div className="mb-2 fw-semibold">{p.texto}</div>
                          {renderControl(p)}
                        </li>
                      ))}
                    </ol>
                  );
                })()}
              </div>
            </Card>
          )}

          {/* CONTROLES DE PÁGINA + BOTONES FINALES */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-outline-secondary"
              disabled={categoriaIndex <= 0}
              onClick={async () => {
                const payload = convertirRespuestasParaBackend(respuestas);
                await guardarBorradorInforme(finalId, { respuestas: payload });

                setCategoriaIndex((idx) => Math.max(0, idx - 1));
              }}
            >
              ← Anterior
            </button>

            <small className="text-muted">
              Sección {categoriaIndex + 1} de {totalCategorias}
            </small>

            <button
              className="btn btn-outline-primary"
              disabled={categoriaIndex >= totalCategorias - 1}
              onClick={async () => {
                const payload = convertirRespuestasParaBackend(respuestas);
                await guardarBorradorInforme(finalId, { respuestas: payload });

                setCategoriaIndex((idx) =>
                  Math.min(totalCategorias - 1, idx + 1)
                );
              }}
            >
              Siguiente →
            </button>
          </div>

          <hr className="my-4" />

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-light border"
              onClick={() => navigate("/docente")}
            >
              Volver al panel de docente
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                try {
                  const payload = convertirRespuestasParaBackend(respuestas);

                  // Guardado final del borrador
                  await guardarBorradorInforme(finalId, { respuestas: payload });

                  // Cambiar estado a finalizado
                  await finalizarInforme(finalId);

                  navigate("/docente");
                } catch (e) {
                  console.error("Error al completar informe", e);
                }
              }}
            >
              Completar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
