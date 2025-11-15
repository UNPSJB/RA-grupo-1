import { useEffect, useState, Fragment } from "react";

type RespuestaValor = { 
  opcion_id: number | null; 
  texto_respuesta: string | null; 
};

interface Pregunta { 
  id: number; 
  enunciado: string; 
  categoria_id?: number; 
}

interface Categoria { 
  id: number; 
  cod: string; 
  texto: string; 
  preguntas: Pregunta[]; 
}

interface OpcionPorcentaje { 
  opcion_id: string; 
  porcentaje: number; 
}

interface DatosEstadisticosPregunta { 
  id_pregunta: string; 
  datos: OpcionPorcentaje[]; 
}

interface DatosEstadisticosCategoria { 
  categoria_cod: string; 
  categoria_texto: string; 
  promedio_categoria: OpcionPorcentaje[]; 
  preguntas: DatosEstadisticosPregunta[]; 
}

interface Props {
  categoria: Categoria;
  manejarCambio: (preguntaId: number, valor: RespuestaValor) => void;
  estadisticas: DatosEstadisticosCategoria[];
  respuestas: Record<number, RespuestaValor>;
  isReadOnly?: boolean;
}

export default function Categoria2BInforme({ categoria, manejarCambio, estadisticas, respuestas, isReadOnly = false}: Props) {
  const [observacion, setObservacion] = useState<Pregunta | null>(null);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);

  const autoExpand = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  useEffect(() => {
    if (!categoria) return;
    const obs = categoria.preguntas.find((p) =>
      p.enunciado.toLowerCase().includes("observaciones")
    );
    setObservacion(obs || null);
    const preguntasDeTabla = categoria.preguntas.filter(
      (p) => p.enunciado.includes(":") && (!obs || p.id !== obs.id)
    );
    setPreguntas(preguntasDeTabla);
  }, [categoria]);

  useEffect(() => {
    if (isReadOnly || !estadisticas || estadisticas.length === 0 || preguntas.length === 0) return;
    
    preguntas.forEach((p) => {
      const catEst = estadisticas.find((e) => p.enunciado.includes(`${e.categoria_cod}:`));
      if (catEst) {
        const valor = catEst.promedio_categoria
          .map((op) => `${op.opcion_id}: ${op.porcentaje.toFixed(2)}%`)
          .join(" | ");
        if (respuestas[p.id]?.texto_respuesta !== valor) {
          manejarCambio(p.id, {
            opcion_id: null,
            texto_respuesta: valor,
          });
        }
      }
    });
  }, [isReadOnly, estadisticas, preguntas, respuestas, manejarCambio]);

  const actualizarRespuestaTexto = (preguntaId: number, texto: string) => {
    manejarCambio(preguntaId, {
      opcion_id: null,
      texto_respuesta: texto,
    });
  };

  return (
    <Fragment>
      <div className="table-responsive">
        <table className="table table-bordered m-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: "55%" }}>Grupo-Denominación</th>
              <th style={{ width: "45%" }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {preguntas.map((p) => (
              <tr key={p.id}>
                <td>{p.enunciado}</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={respuestas[p.id]?.texto_respuesta || ""}
                    readOnly={true}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {observacion && (
        <div className="mt-4">
          <label className="form-label fw-bold">{observacion.enunciado}</label>
          
          {isReadOnly ? (
            <p className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
              {respuestas[observacion.id]?.texto_respuesta || "—"}
            </p>
          ) : (
            <textarea
              className="form-control"
              rows={3}
              value={respuestas[observacion.id]?.texto_respuesta || ""}
              onChange={(e) => {
                actualizarRespuestaTexto(observacion.id, e.target.value);
                autoExpand(e);
              }}
              onInput={autoExpand}
              style={{ resize: "none" }}
            ></textarea>
          )}
        </div>
      )}
    </Fragment>
  );
}