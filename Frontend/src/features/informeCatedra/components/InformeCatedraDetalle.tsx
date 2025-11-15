import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchInformeCatedra, fetchInformeCatedraConPreguntas,} from "../services/informeCatedraServices";

type TipoPregunta = "abierta" | "opcion_multiple" | "unica_opcion" | "booleana";
type Opcion = { id: number; contenido: string };
type Pregunta = { id: number; texto: string; tipo: TipoPregunta; nro_pregunta?: number; opciones?: Opcion[] };
type Categoria = { id: number; codigo: string; texto: string; preguntas?: Pregunta[] };
type Informe = { id: number; titulo: string };

type RespuestaLocal =
  | { tipo: "abierta"; texto: string }
  | { tipo: "unica_opcion" | "booleana"; opcionId: number | null }
  | { tipo: "opcion_multiple"; opcionIds: number[] };

export default function InformeCatedraDetalle() {
  const { id } = useParams<{ id: string }>();
  const informeId = useMemo(() => Number(id), [id]);

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [informe, setInforme] = useState<Informe | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [respuestas, setRespuestas] = useState<Record<number, RespuestaLocal>>({});

  // Cabecera harcodeada, falta recuperar valores
  const cabecera = {
    sede: "Trelew",
    ciclo: "2025",
    actividad: "Desarrollo de Software",
    codigoActividad: "IF012",
    docente: "Bruno Pazos",
    inscriptos: 32,
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError(null);
        setLoading(true);
        const [inf, catsRaw] = await Promise.all([
          fetchInformeCatedra(informeId),
          fetchInformeCatedraConPreguntas(informeId),
        ]);

        if (!alive) return;

        // Ordena por categoria y el nro_pregunra
        const cats: Categoria[] = (catsRaw ?? [])
          .slice()
          .sort((a: Categoria, b: Categoria) => (a.id ?? 0) - (b.id ?? 0))
          .map((c: Categoria) => ({
            ...c,
            preguntas: (c.preguntas ?? [])
              .slice()
              .sort((p1, p2) => (p1.nro_pregunta ?? 0) - (p2.nro_pregunta ?? 0)),
          }));

        setInforme(inf);
        setCategorias(cats);
      } catch (e: any) {
        setError(e?.message ?? "No se pudo cargar el informe");
      } finally {
        alive && setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [informeId]);

  const setAbierta = (preguntaId: number, texto: string) =>
    setRespuestas((r) => ({ ...r, [preguntaId]: { tipo: "abierta", texto } }));

  const toggleMultiple = (preguntaId: number, opcionId: number) =>
    setRespuestas((r) => {
      const prev = r[preguntaId];
      const actuales = prev && prev.tipo === "opcion_multiple" ? [...prev.opcionIds] : [];
      const i = actuales.indexOf(opcionId);
      i >= 0 ? actuales.splice(i, 1) : actuales.push(opcionId);
      return { ...r, [preguntaId]: { tipo: "opcion_multiple", opcionIds: actuales } };
    });

  const setUnica = (preguntaId: number, opcionId: number) =>
    setRespuestas((r) => ({ ...r, [preguntaId]: { tipo: "unica_opcion", opcionId } }));

  const setBooleana = (preguntaId: number, opcionId: number) =>
    setRespuestas((r) => ({ ...r, [preguntaId]: { tipo: "booleana", opcionId } }));

  if (loading) return <div className="container py-4">Cargando…</div>;
  if (error)   return <div className="container py-4 text-danger">{error}</div>;
  if (!informe) return null;

  const todasOrdenadas: Pregunta[] = categorias.flatMap(c => c.preguntas ?? []);
  const qHeader = todasOrdenadas.slice(0, 3); // primeras 3
  const headerIds = new Set(qHeader.map(q => q.id));

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
          {(p.opciones ?? []).map(op => (
            <div key={op.id} className="form-check mb-1">
              <input
                className="form-check-input"
                type="radio"
                name={`p-${p.id}`}
                checked={!!(r && r.tipo === "unica_opcion" && r.opcionId === op.id)}
                onChange={() => setUnica(p.id, op.id)}
                id={`p-${p.id}-op-${op.id}`}
              />
              <label htmlFor={`p-${p.id}-op-${op.id}`} className="form-check-label">
                {op.contenido}
              </label>
            </div>
          ))}
        </div>
      );
    }
    if (p.tipo === "booleana") {
      return (
        <div className="form-check-group">
          {(p.opciones ?? []).map(op => (
            <div key={op.id} className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name={`p-${p.id}`}
                checked={!!(r && r.tipo === "booleana" && r.opcionId === op.id)}
                onChange={() => setBooleana(p.id, op.id)}
                id={`p-${p.id}-op-${op.id}`}
              />
              <label htmlFor={`p-${p.id}-op-${op.id}`} className="form-check-label">
                {op.contenido}
              </label>
            </div>
          ))}
        </div>
      );
    }
    // opcion_multiple
    return (
      <div className="form-check-group">
        {(p.opciones ?? []).map(op => {
          const checked =
            r && r.tipo === "opcion_multiple" && (r.opcionIds || []).includes(op.id);
          return (
            <div key={op.id} className="form-check mb-1">
              <input
                className="form-check-input"
                type="checkbox"
                checked={!!checked}
                onChange={() => toggleMultiple(p.id, op.id)}
                id={`p-${p.id}-op-${op.id}`}
              />
              <label htmlFor={`p-${p.id}-op-${op.id}`} className="form-check-label">
                {op.contenido}
              </label>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container py-4">
      <div className="mx-auto" style={{ maxWidth: 2000 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">{"Informe de Actividad Curricular"}</h3>
          <Link to="/docente" className="btn btn-outline-secondary btn-sm">Volver</Link>
      </div>
    </div>

      <div className="card mb-4 mt-4 shadow-sm">
        <div className="card-body p-0">
          <table className="table table-bordered table-sm mb-0">
            <tbody>
              <tr><th style={{ width: 300 }}>Sede</th><td>{cabecera.sede}</td></tr>
              <tr><th>Ciclo Lectivo</th><td>{cabecera.ciclo}</td></tr>
              <tr><th>Actividad curricular</th><td>{cabecera.actividad}</td></tr>
              <tr><th>Código de la actividad curricular</th><td>{cabecera.codigoActividad}</td></tr>
              <tr><th>Docente responsable</th><td>{cabecera.docente}</td></tr>
              <tr><th>Cantidad de alumnos inscriptos</th><td>{cabecera.inscriptos}</td></tr>

              {/* Renglones “formularios” para las 3 primeras preguntas */}
              {qHeader.map((p, idx) => (
                <tr key={p.id}>
                  <th>
                    {p.texto}
                    <div className="small text-muted mt-1"></div>
                  </th>
                  <td>{renderControl(p)}</td>
                </tr>
              ))}
              {/* Si hay menos de 3 preguntas, completa filas vacías para mantener el layout */}
              {Array.from({ length: Math.max(0, 3 - qHeader.length) }).map((_, i) => (
                <tr key={`empty-${i}`}><th>—</th><td>—</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {categorias.map(cat => {
        const preguntasResto = (cat.preguntas ?? []).filter(p => !headerIds.has(p.id));
        return (
          <div key={cat.id} className="card mb-3">
            <div className="card-header">
              <strong>{cat.codigo}</strong> — {cat.texto}
            </div>
            <div className="card-body">
              {preguntasResto.length === 0 ? (
                <div className="text-muted">Sin preguntas.</div>
              ) : (
                <ol className="mb-0">
                  {preguntasResto.map(p => (
                    <li key={p.id} className="mb-3">
                      <div className="mb-2 fw-semibold">{p.texto}</div>
                      {renderControl(p)}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        );
      })}
      <hr className="my-4" />
      <div className="d-flex justify-content-end">
        <Link to="/docente" className="btn btn-primary">
          Guardar
        </Link>
      </div>
    </div>
  );
}
