import { Fragment } from "react"; 
import Categoria2BInforme from "./Categoria2B";
import Categoria2CInforme from "./Categoria2C";
import Categoria3Informe from "./Categoria3";
import Categoria4Informe from "./Categoria4";
import CategoriaEquipamiento from "./Categoria1";
import CompletarInformeCatedraFuncion from "./CompletarInformeCatedraFuncion";

interface Pregunta { id: number; enunciado: string; categoria_id: number; }
interface CategoriaConPreguntas { id: number; cod: string; texto: string; preguntas: Pregunta[]; }

type RespuestaValor = {
  opcion_id: number | null;
  texto_respuesta: string | null;
};

interface ContenidoPasosProps {
  currentStep: number;
  categoriasConPreguntas: CategoriaConPreguntas[];
  respuestas: Record<number, RespuestaValor>;
  docenteasignaturasId: number;
  manejarCambio: (preguntaId: number, valor: RespuestaValor) => void;
  onDatosGenerados: (datos: any) => void;
  nombresFuncion: { JTP: string | null; aux1: string | null; aux2: string | null };
  setNombresFuncion?: {
    SetJTP: React.Dispatch<React.SetStateAction<string>>;
    SetAux1: React.Dispatch<React.SetStateAction<string>>;
    SetAux2: React.Dispatch<React.SetStateAction<string>>;
  };
  isReadOnly?: boolean;
  datosIniciales?: any;
}

const normalizarString = (texto: string): string => {
  if (!texto) return "";
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export default function ContenidoPasos({
  currentStep,
  categoriasConPreguntas,
  respuestas,
  docenteasignaturasId,
  manejarCambio,
  onDatosGenerados,
  nombresFuncion,
  setNombresFuncion,
  isReadOnly = false,
  datosIniciales
}: ContenidoPasosProps) {

  const categoria1 = categoriasConPreguntas.find(cat => cat.cod === "1");
  const categoria2 = categoriasConPreguntas.find(cat => cat.cod === "2");
  const categoria2A = categoriasConPreguntas.find(cat => cat.cod === "2.A");
  const categoria2B = categoriasConPreguntas.find(cat => cat.cod === "2.B");
  const categoria2C = categoriasConPreguntas.find(cat => cat.cod === "2.C");
  const categoria3 = categoriasConPreguntas.find(cat => cat.cod === "3");
  const categoria4 = categoriasConPreguntas.find(cat => cat.cod === "4");

  const autoExpand = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const handlePercentageChange = (
    pregunta: Pregunta | undefined, 
    valor: string
  ) => {
    if (!pregunta) return;
    if (valor === "") {
      manejarCambio(pregunta.id, { opcion_id: null, texto_respuesta: "" });
      return;
    }
    const num = Number(valor);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      manejarCambio(pregunta.id, { opcion_id: null, texto_respuesta: valor });
    }
  };

  const renderCategoria2 = (categoria: CategoriaConPreguntas) => {
    const pTeoricas = categoria.preguntas.find(p => normalizarString(p.enunciado).includes("clases teoricas"));
    const pPracticas = categoria.preguntas.find(p => normalizarString(p.enunciado).includes("clases practicas"));
    const pJustificacion = categoria.preguntas.find(p => normalizarString(p.enunciado).includes("justificacion"));

    return (
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-bold">{pTeoricas?.enunciado}</label>
          {isReadOnly ? (
            <p className="form-control-plaintext ps-1">{respuestas[pTeoricas?.id || 0]?.texto_respuesta || "0"}%</p>
          ) : (
            <input
              type="number"
              className="form-control"
              value={respuestas[pTeoricas?.id || 0]?.texto_respuesta || ""}
              onChange={(e) => handlePercentageChange(pTeoricas, e.target.value)}
              min="0"
              max="100"
            />
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">{pPracticas?.enunciado}</label>
          {isReadOnly ? (
            <p className="form-control-plaintext ps-1">{respuestas[pPracticas?.id || 0]?.texto_respuesta || "0"}%</p>
          ) : (
            <input
              type="number"
              className="form-control"
              value={respuestas[pPracticas?.id || 0]?.texto_respuesta || ""}
              onChange={(e) => handlePercentageChange(pPracticas, e.target.value)}
              min="0"
              max="100"
            />
          )}
        </div>

        {pJustificacion && (
          <div className="col-12 mt-3">
            <label className="form-label fw-bold">{pJustificacion.enunciado}</label>
            {isReadOnly ? (
              <p className="form-control-plaintext">{respuestas[pJustificacion.id]?.texto_respuesta || "—"}</p>
            ) : (
              <textarea
                className="form-control"
                value={respuestas[pJustificacion.id]?.texto_respuesta || ""}
                onChange={(e) => {
                  manejarCambio(pJustificacion.id, { opcion_id: null, texto_respuesta: e.target.value });
                  autoExpand(e);
                }}
                style={{ resize: "none", minHeight: "100px", overflow: "hidden" }}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const renderCategoria2A = (categoria: CategoriaConPreguntas) => {
    const pPorcentaje = categoria.preguntas.find(p => normalizarString(p.enunciado).includes("cantidad de temas desarrollados"));
    const pEstrategias = categoria.preguntas.find(p => normalizarString(p.enunciado).includes("estrategias"));
  
    return (
      <div className="row g-3">
        {pPorcentaje && (
          <div className="col-md-4">
            <label className="form-label fw-bold">{pPorcentaje.enunciado}</label>
            {isReadOnly ? (
              <p className="form-control-plaintext">{respuestas[pPorcentaje.id]?.texto_respuesta || "0"}%</p>
            ) : (
              <input
                type="number"
                className="form-control"
                value={respuestas[pPorcentaje.id]?.texto_respuesta || ""}
                onChange={(e) => handlePercentageChange(pPorcentaje, e.target.value)}
                min="0"
                max="100"
              />
            )}
          </div>
        )}

        {pEstrategias && (
          <div className="col-12 mt-3">
            <label className="form-label fw-bold">{pEstrategias.enunciado}</label>
            {isReadOnly ? (
              <p className="form-control-plaintext">{respuestas[pEstrategias.id]?.texto_respuesta || "—"}</p>
            ) : (
              <textarea
                className="form-control"
                value={respuestas[pEstrategias.id]?.texto_respuesta || ""}
                onChange={(e) => {
                  manejarCambio(pEstrategias.id, { opcion_id: null, texto_respuesta: e.target.value });
                  autoExpand(e);
                }}
                style={{ resize: "none", minHeight: "100px", overflow: "hidden" }}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  switch (currentStep) {
    case 1:
      return (
        <CompletarInformeCatedraFuncion
          docenteasignaturasId={docenteasignaturasId}
          onDatosGenerados={onDatosGenerados}
          isReadOnly={isReadOnly}
          datosIniciales={datosIniciales}
          nombresFuncion={nombresFuncion}
          setNombresFuncion={setNombresFuncion}
        />
      );

    case 2:
      return (
        <Fragment>
          <h5 className="text-dark fw-bold mb-3">1. Recursos</h5>
          <hr className="mb-4" />
          {categoria1 && (
            <CategoriaEquipamiento
              categoria={categoria1}
              manejarCambio={manejarCambio}
              isReadOnly={isReadOnly}
              respuestas={respuestas}
            />
          )}
        </Fragment>
      );

    case 3:
      return (
        <Fragment>
          <h5 className="text-dark fw-bold mb-3">2. Desarrollo Curricular</h5>
          <hr className="mb-4" />
          {categoria2 && renderCategoria2(categoria2)}
          {categoria2A && renderCategoria2A(categoria2A)}
          {categoria2B && (
            <Categoria2BInforme
              categoria={categoria2B}
              manejarCambio={manejarCambio}
              respuestas={respuestas}
              isReadOnly={isReadOnly}
            />
          )}
          {categoria2C && (
            <Categoria2CInforme
              categoria={categoria2C}
              manejarCambio={manejarCambio}
              respuestas={respuestas}
              isReadOnly={isReadOnly}
            />
          )}
        </Fragment>
      );

    case 4:
      return (
        <Fragment>
          <h5 className="text-dark fw-bold mb-3">3. Actividades del Equipo Docente</h5>
          <hr className="mb-4" />
          {categoria3 && (
            <Categoria3Informe
              categoria={categoria3}
              manejarCambio={manejarCambio}
              respuestas={respuestas}
              isReadOnly={isReadOnly}
              nombresFuncion={nombresFuncion}
            />
          )}
        </Fragment>
      );

    case 5:
      return (
        <Fragment>
          <h5 className="text-dark fw-bold mb-3">4. Valoración de Auxiliares</h5>
          <hr className="mb-4" />
          {categoria4 && (
            <Categoria4Informe
              categoria={categoria4}
              manejarCambio={manejarCambio}
              respuestas={respuestas}
              isReadOnly={isReadOnly}
              nombresFuncion={nombresFuncion}
            />
          )}
        </Fragment>
      );

    default:
      return null;
  }
}
