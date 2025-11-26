import { useEffect, useState, Fragment } from "react";

type RespuestaValor = { 
  opcion_id: number | null; 
  texto_respuesta: string | null; 
};

interface Pregunta { 
  id: number; 
  enunciado: string; 
  categoria_id: number; 
}

interface Categoria { 
  id: number; 
  cod: string; 
  texto: string; 
  preguntas: Pregunta[]; 
}

interface Props {
  categoria: Categoria;
  manejarCambio: (preguntaId: number, valor: RespuestaValor) => void;
  respuestas: Record<number, RespuestaValor>;
  isReadOnly?: boolean;
}

export default function Categoria2CInforme({ categoria, manejarCambio, respuestas, isReadOnly = false}: Props) {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [reflexion, setReflexion] = useState<Pregunta | null>(null);

  const autoExpandRefCallback = (element: HTMLTextAreaElement | null) => {
    if (element) {
      setTimeout(() => {
        element.style.height = "auto";
        element.style.height = element.scrollHeight + "px";
      }, 400);
    }
  };

  const autoExpand = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  useEffect(() => {
    if (!categoria) return;
    const reflexionEncontrada = categoria.preguntas.find((p) =>
      p.enunciado.toLowerCase().includes("resumen de la reflexión")
    );
    setReflexion(reflexionEncontrada || null);
    const sinReflexion = reflexionEncontrada
      ? categoria.preguntas.filter((p) => p.id !== reflexionEncontrada.id)
      : categoria.preguntas;
    setPreguntas(sinReflexion);
  }, [categoria]);

  const actualizarRespuestaTexto = (preguntaId: number, texto: string) => {
    manejarCambio(preguntaId, {
      opcion_id: null,
      texto_respuesta: texto,
    });
  };

  const getPregunta = (texto: string) =>
    preguntas.find((p) => p.enunciado.toLowerCase().includes(texto.toLowerCase()));

  const pEnsPos = getPregunta("Aspectos positivos: Proceso Enseñanza");
  const pAprPos = getPregunta("Aspectos positivos: Proceso de aprendizaje");
  const pEnsObs = getPregunta("Obstáculos: Proceso Enseñanza");
  const pAprObs = getPregunta("Obstáculos: Proceso de aprendizaje");
  const pEstrategias = getPregunta("Estrategias a implementar");

  return (
    <Fragment>
      <div className="mb-4">
        <h6 className="fw-bold mb-3">Aspectos positivos</h6>
        <div className="mb-3">
          <label className="form-label mb-2 fw-bold">
            Proceso enseñanza
          </label>
          {isReadOnly ? (
            <p className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
              {respuestas[pEnsPos?.id || 0]?.texto_respuesta?.trim() || "—"}
            </p>
          ) : (
            <textarea
              ref={autoExpandRefCallback}
              className="form-control"
              rows={3}
              value={respuestas[pEnsPos?.id || 0]?.texto_respuesta || ""}
              onChange={(e) => {
                pEnsPos && actualizarRespuestaTexto(pEnsPos.id, e.target.value);
                autoExpand(e);
              }}
              onInput={autoExpand}
              disabled={!pEnsPos}
              style={{ resize: "none", minHeight: "80px" }}
            />
          )}
        </div>
        <div>
          <label className="form-label mb-2 fw-bold">
            Proceso de aprendizaje
          </label>
          {isReadOnly ? (
            <p className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
              {respuestas[pAprPos?.id || 0]?.texto_respuesta?.trim() || "—"}
            </p>
          ) : (
            <textarea
              ref={autoExpandRefCallback}
              className="form-control"
              rows={3}
              value={respuestas[pAprPos?.id || 0]?.texto_respuesta || ""}
              onChange={(e) => {
                pAprPos && actualizarRespuestaTexto(pAprPos.id, e.target.value);
                autoExpand(e);
              }}
              onInput={autoExpand}
              disabled={!pAprPos}
              style={{ resize: "none", minHeight: "80px" }}
            />
          )}
        </div>
      </div>

      <div className="mb-4">
        <h6 className="fw-bold mb-3">Obstáculos</h6>
        <div className="mb-3">
          <label className="form-label mb-2 fw-bold">
            Proceso enseñanza
          </label>
          {isReadOnly ? (
            <p className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
              {respuestas[pEnsObs?.id || 0]?.texto_respuesta?.trim() || "—"}
            </p>
          ) : (
            <textarea
              ref={autoExpandRefCallback}
              className="form-control"
              rows={3}
              value={respuestas[pEnsObs?.id || 0]?.texto_respuesta || ""}
              onChange={(e) => {
                pEnsObs && actualizarRespuestaTexto(pEnsObs.id, e.target.value);
                autoExpand(e);
              }}
              onInput={autoExpand}
              disabled={!pEnsObs}
              style={{ resize: "none", minHeight: "80px" }}
            />
          )}
        </div>
        <div>
          <label className="form-label mb-2 fw-bold">
            Proceso de aprendizaje
          </label>
          {isReadOnly ? (
            <p className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
              {respuestas[pAprObs?.id || 0]?.texto_respuesta?.trim() || "—"}
            </p>
          ) : (
            <textarea
              ref={autoExpandRefCallback}
              className="form-control"
              rows={3}
              value={respuestas[pAprObs?.id || 0]?.texto_respuesta || ""}
              onChange={(e) => {
                pAprObs && actualizarRespuestaTexto(pAprObs.id, e.target.value);
                autoExpand(e);
              }}
              onInput={autoExpand}
              disabled={!pAprObs}
              style={{ resize: "none", minHeight: "80px" }}
            />
          )}
        </div>
      </div>

      <div className="mb-4">
        <h6 className="fw-bold mb-3">Estrategias a implementar</h6>
        {isReadOnly ? (
          <p className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
            {respuestas[pEstrategias?.id || 0]?.texto_respuesta?.trim() || "—"}
          </p>
        ) : (
          <textarea
            ref={autoExpandRefCallback}
            className="form-control"
            rows={3}
            value={respuestas[pEstrategias?.id || 0]?.texto_respuesta || ""}
            onChange={(e) => {
              pEstrategias && actualizarRespuestaTexto(pEstrategias.id, e.target.value);
              autoExpand(e);
            }}
            onInput={autoExpand}
            disabled={!pEstrategias}
            style={{ resize: "none", minHeight: "80px" }}
          />
        )}
      </div>

      {reflexion && (
        <div className="mb-4">
          <h6 className="fw-bold mb-3">{reflexion.enunciado}</h6>
          {isReadOnly ? (
            <p className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
              {respuestas[reflexion.id]?.texto_respuesta?.trim() || "—"}
            </p>
          ) : (
            <textarea
              ref={autoExpandRefCallback}
              className="form-control"
              rows={4}
              value={respuestas[reflexion.id]?.texto_respuesta || ""}
              onChange={(e) => {
                actualizarRespuestaTexto(reflexion.id, e.target.value);
                autoExpand(e);
              }}
              onInput={autoExpand}
              style={{ resize: "none", minHeight: "100px" }}
            />
          )}
        </div>
      )}
    </Fragment>
  );
}