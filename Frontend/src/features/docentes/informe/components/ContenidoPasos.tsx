import { Fragment} from "react"; 
import Categoria2BInforme from "./CAT2B";
import Categoria2CInforme from "./CAT2C";
import Categoria3Informe from "./CAT3";
import Categoria4Informe from "./CAT4";
import CategoriaEquipamiento from "./CAT1";
import TablaDatosEstadisticos from "../../datosEstadisticos/TablaDatosEstadisticos";
import CompletarInformeCatedraFuncion from "./CompletarInformeCatedraFuncion";
import RespuestasAbiertas from "./RespuestasAbiertas";

interface Pregunta { id: number; enunciado: string; categoria_id: number; }
interface CategoriaConPreguntas { id: number; cod: string; texto: string; preguntas: Pregunta[]; }
interface OpcionPorcentaje { opcion_id: string; porcentaje: number; }
interface DatosEstadisticosPregunta { id_pregunta: string; datos: OpcionPorcentaje[]; }
interface DatosEstadisticosCategoria { categoria_cod: string; categoria_texto: string; promedio_categoria: OpcionPorcentaje[]; preguntas: DatosEstadisticosPregunta[]; }
type RespuestaValor = { opcion_id: number | null; texto_respuesta: string | null; };

interface ContenidoPasosProps {
  currentStep: number;
  categoriasConPreguntas: CategoriaConPreguntas[];
  datosEstadisticos: DatosEstadisticosCategoria[];
  cantidad: number;
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
  datosEstadisticos,
  cantidad,
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
          <label htmlFor={`preg-${pTeoricas?.id}`} className="form-label fw-bold">
            {pTeoricas?.enunciado || "Porcentaje Clases Teóricas"}
          </label>
          {isReadOnly ? (
            <p className="form-control-plaintext ps-1">
              {respuestas[pTeoricas?.id || 0]?.texto_respuesta || "0"}%
            </p>
          ) : (
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                id={`preg-${pTeoricas?.id}`}
                value={respuestas[pTeoricas?.id || 0]?.texto_respuesta || ""}
                onChange={(e) => handlePercentageChange(pTeoricas, e.target.value)}
                disabled={!pTeoricas}
                min="0"
                max="100"
                aria-describedby="teoricas-addon"
              />
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor={`preg-${pPracticas?.id}`} className="form-label fw-bold">
            {pPracticas?.enunciado || "Porcentaje Clases Prácticas"}
          </label>
          {isReadOnly ? (
            <p className="form-control-plaintext ps-1">
              {respuestas[pPracticas?.id || 0]?.texto_respuesta || "0"}%
            </p>
          ) : (
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                id={`preg-${pPracticas?.id}`}
                value={respuestas[pPracticas?.id || 0]?.texto_respuesta || ""}
                onChange={(e) => handlePercentageChange(pPracticas, e.target.value)}
                disabled={!pPracticas}
                min="0"
                max="100"
                aria-describedby="practicas-addon"
              />
            </div>
          )}
        </div>

        {pJustificacion && (
          <div className="col-12 mt-3">
            <label htmlFor={`preg-${pJustificacion.id}`} className="form-label fw-bold">
              {pJustificacion.enunciado}
            </label>
            {isReadOnly ? (
              <p className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
                {respuestas[pJustificacion.id]?.texto_respuesta || "—"}
              </p>
            ) : (
              <textarea
                className="form-control"
                id={`preg-${pJustificacion.id}`}
                value={respuestas[pJustificacion.id]?.texto_respuesta || ""}
                onChange={(e) =>{
                  manejarCambio(pJustificacion.id, {
                    opcion_id: null,
                    texto_respuesta: e.target.value,
                  });
                  autoExpand(e);
                }}
                onInput={autoExpand} 
                style={{
                  resize: 'none',
                  minHeight: '100px',
                  overflow: 'hidden'
                }}
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
            <label htmlFor={`preg-${pPorcentaje.id}`} className="form-label fw-bold">
              {pPorcentaje.enunciado}
            </label>
            {isReadOnly ? (
              <p className="form-control-plaintext ps-1">
                {respuestas[pPorcentaje.id || 0]?.texto_respuesta || "0"}%
              </p>
            ) : (
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  id={`preg-${pPorcentaje.id}`}
                  value={respuestas[pPorcentaje.id || 0]?.texto_respuesta || ""}
                  onChange={(e) => handlePercentageChange(pPorcentaje, e.target.value)}
                  min="0"
                  max="100" 
                  aria-describedby="porcentaje-addon"
                />
              </div>
            )}
          </div>
        )}

        {pEstrategias && (
          <div className="col-12 mt-3">
            <label htmlFor={`preg-${pEstrategias.id}`} className="form-label fw-bold">
              {pEstrategias.enunciado}
            </label>
            {isReadOnly ? (
              <p className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
                {respuestas[pEstrategias.id]?.texto_respuesta || "—"}
              </p>
            ) : (
              <textarea
                className="form-control"
                id={`preg-${pEstrategias.id}`}
                value={respuestas[pEstrategias.id]?.texto_respuesta || ""}
                onChange={(e) =>{
                  manejarCambio(pEstrategias.id, {
                    opcion_id: null,
                    texto_respuesta: e.target.value,
                  });
                  autoExpand(e);
                }}
                onInput={autoExpand} 
                style={{
                  resize: 'none',
                  minHeight: '100px',
                  overflow: 'hidden'
                }}
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
          <h5 className="text-dark fw-bold mb-3">Resultados de Encuestas</h5>
          <p className="text-muted mb-4">
            Análisis basado en las encuestas completadas por los estudiantes.
          </p>
          <hr className="mb-4" />

          <TablaDatosEstadisticos 
            datos={datosEstadisticos}
            cant={cantidad} 
          />
          <RespuestasAbiertas docenteasignaturasId={docenteasignaturasId} />
        </Fragment>
      );

    case 3:
      return categoria1 ? (
        <Fragment>
          <h5 className="text-dark fw-bold mb-3">1. Equipamiento y Bibliografía</h5>
          <p className="text-muted mb-4">{categoria1.texto}</p>
          <hr className="mb-4" />
          <CategoriaEquipamiento
            categoria={categoria1}
            manejarCambio={manejarCambio}
            isReadOnly={isReadOnly}
            respuestas={respuestas}
          />
        </Fragment>
      ) : null;

    case 4:
      return (
        <Fragment>
          <h5 className="text-dark fw-bold mb-3">2. Desarrollo Curricular</h5>
          <hr className="mb-4" />
          <div className="accordion accordion-flush" id="accordionPaso3">
            {categoria2 && (
              <div className="accordion-item">
                <h2 className="accordion-header" id="heading2">
                  <button 
                    className={`accordion-button ${isReadOnly ? "" : "collapsed"}`} 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#collapse2"
                    disabled={isReadOnly}
                  >
                    2. Porcentaje de Horas de Clases
                  </button>
                </h2>
                <div id="collapse2" className={`accordion-collapse collapse ${isReadOnly ? 'show' : ''}`} data-bs-parent="#accordionPaso3">
                  <div className="accordion-body">
                    <p className="text-muted mb-3">{categoria2.texto}</p>
                    {renderCategoria2(categoria2)}
                  </div>
                </div>
              </div>
            )}            
            {categoria2A && (
              <div className="accordion-item">
                <h2 className="accordion-header" id="heading2A">
                  <button 
                    className={`accordion-button ${isReadOnly ? "" : "collapsed"}`} 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#collapse2A"
                    disabled={isReadOnly}
                  >
                    2.A. Totalidad de Contenidos
                  </button>
                </h2>
                <div id="collapse2A" className={`accordion-collapse collapse ${isReadOnly ? 'show' : ''}`} data-bs-parent="#accordionPaso3">
                  <div className="accordion-body">
                    <p className="text-muted mb-3">{categoria2A.texto}</p>
                    {renderCategoria2A(categoria2A)}
                  </div>
                </div>
              </div>
            )}

            {categoria2B && (
              <div className="accordion-item">
                <h2 className="accordion-header" id="heading2B">
                  <button 
                    className={`accordion-button ${isReadOnly ? "" : "collapsed"}`} 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#collapse2B"
                    disabled={isReadOnly}
                  >
                    2.B. Análisis de Encuestas
                  </button>
                </h2>
                <div id="collapse2B" className={`accordion-collapse collapse ${isReadOnly ? 'show' : ''}`} data-bs-parent="#accordionPaso3">
                  <div className="accordion-body">
                    <p className="text-muted mb-3">{categoria2B.texto}</p>
                    <Categoria2BInforme
                      categoria={categoria2B}
                      manejarCambio={manejarCambio}
                      estadisticas={datosEstadisticos}
                      respuestas={respuestas}
                      isReadOnly={isReadOnly}
                    />
                  </div>
                </div>
              </div>
            )}

            {categoria2C && (
              <div className="accordion-item">
                <h2 className="accordion-header" id="heading2C">
                  <button 
                    className={`accordion-button ${isReadOnly ? "" : "collapsed"}`} 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#collapse2C"
                    disabled={isReadOnly}
                  >
                    2.C. Reflexión Docente
                  </button>
                </h2>
                <div id="collapse2C" className={`accordion-collapse collapse ${isReadOnly ? 'show' : ''}`} data-bs-parent="#accordionPaso3">
                  <div className="accordion-body">
                    <p className="text-muted mb-3">{categoria2C.texto}</p>
                    <Categoria2CInforme
                      categoria={categoria2C}
                      manejarCambio={manejarCambio}
                      respuestas={respuestas}
                      isReadOnly={isReadOnly}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Fragment> 
      );

    case 5:
      return categoria3 ? (
        <Fragment>
          <h5 className="text-dark fw-bold mb-3">3. Actividades del Equipo Docente</h5>
          <p className="text-muted mb-4">{categoria3.texto}</p>
          <hr className="mb-4" />
          <div className="accordion accordion-flush" id="accordionPaso4">
            <Categoria3Informe
              categoria={categoria3}
              manejarCambio={manejarCambio}
              respuestas={respuestas}
              isReadOnly={isReadOnly}
              nombresFuncion={nombresFuncion}
            />
          </div>
        </Fragment>
      ) : null;

    case 6:
      return (
        <Fragment>
          {categoria4 && (
            <div className="mb-4">
              <h5 className="text-dark fw-bold mb-3">4. Valoración de Auxiliares</h5>
              <p className="text-muted mb-4">{categoria4.texto}</p>
              <hr className="mb-4" />
              <Categoria4Informe
                categoria={categoria4}
                manejarCambio={manejarCambio}
                respuestas={respuestas}
                isReadOnly={isReadOnly}
                nombresFuncion={nombresFuncion}
              />
            </div>
          )}
        </Fragment>
      );

    default:
      return null;
  }
}