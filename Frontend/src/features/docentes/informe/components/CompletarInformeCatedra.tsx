import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ANIO_ACTUAL } from "../../../../constants";
import ROUTES from "../../../../paths";
import ContenidoPasos from "./ContenidoPasos";

interface Pregunta {
  id: number;
  enunciado: string;
  categoria_id: number;
}

interface CategoriaConPreguntas {
  id: number;
  codigo: string;
  texto: string;
  preguntas: Pregunta[];
}

type RespuestaValor = {
  opcion_id: number | null;
  texto_respuesta: string | null;
};

export default function CompletarInformeCatedra() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  console.log("STATE RECIBIDO:", location.state);
  console.log("PARAMS RECIBIDOS:", params);

  const {
    docenteasignaturasId,
    asignaturasId,
    asignaturasNombre,
    anio,
    duracion,
    informeBaseId,
  } = location.state || {};

  // Fallback desde params (muy importante)
  const finalInformeBaseId = informeBaseId || params.informe_catedra_id;

  console.log("FINAL informeBaseId:", finalInformeBaseId);

  const [categoriasConPreguntas, setCategoriasConPreguntas] = useState<CategoriaConPreguntas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [respuestas, setRespuestas] = useState<Record<number, RespuestaValor>>({});
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const [cantidadInscriptos, setCantidadInscriptos] = useState<number>(0);
  const [cantidadComisionesTeoricas, setCantidadComisionesTeoricas] = useState(1);
  const [cantidadComisionesPracticas, setCantidadComisionesPracticas] = useState(1);
  const [JTP, SetJTP] = useState("");
  const [aux1, SetAux1] = useState("");
  const [aux2, SetAux2] = useState("");

  const [currentStep, setCurrentStep] = useState(1);

  // NUEVOS PASOS SIN ESTADISTICAS
  const steps = [
    { id: 1, name: "Datos Generales" },
    { id: 2, name: "1. Recursos" },
    { id: 3, name: "2. Desarrollo Curricular" },
    { id: 4, name: "3. Actividades del Equipo" },
    { id: 5, name: "4. Valoración" }
  ];

  const totalSteps = steps.length;

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const goToStep = (stepId: number) => setCurrentStep(stepId);

  // --------------------------------------------------
  // CARGA DEL INFORME BASE
  // --------------------------------------------------
  useEffect(() => {
    if (!finalInformeBaseId) {
      setError("ID de informe base no encontrado.");
      setLoading(false);
      return;
    }

    console.log("Cargando informe base con ID:", finalInformeBaseId);

    fetch(`http://127.0.0.1:8000/informes_catedra/${finalInformeBaseId}/categorias_con_preguntas`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar la estructura del informe.");
        return res.json();
      })
      .then((data: CategoriaConPreguntas[]) => {
        const ordenado = [...data].sort((a, b) =>
          a.codigo.localeCompare(b.codigo, "es", { sensitivity: "base" })
        );
        setCategoriasConPreguntas(ordenado);
      })
      .catch((err) => {
        console.error("Error cargando informe:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [finalInformeBaseId]);

  const manejarCambio = (preguntaId: number, valor: RespuestaValor) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: valor }));
  };

  const manejarDatosGenerados = (datos: any) => {
    setCantidadInscriptos(datos.cantidadAlumnos);
    setCantidadComisionesTeoricas(datos.cantidadComisionesTeoricas);
    setCantidadComisionesPracticas(datos.cantidadComisionesPracticas);
    SetJTP(datos.JTP);
    SetAux1(datos.aux1);
    SetAux2(datos.aux2);
  };

  const enviarInforme = async () => {
    setEnviando(true);
    setMensaje(null);

    const respuestasFormateadas = Object.entries(respuestas).map(
      ([preguntaIdStr, respuestaObj]) => ({
        pregunta_id: parseInt(preguntaIdStr, 10),
        opcion_id: respuestaObj.opcion_id,
        texto_respuesta: respuestaObj.texto_respuesta,
      })
    );

    const datosParaBackend = {
      docente_asignaturas_id: docenteasignaturasId,
      informe_catedra_base_id: finalInformeBaseId,
      titulo: `Informe ${asignaturasNombre} ${anio}`,
      contenido: `Informe para ${asignaturasNombre} (${duracion} ${anio})`,
      cantidadAlumnos: cantidadInscriptos,
      anio: ANIO_ACTUAL,
      duracion,
      cantidadComisionesTeoricas,
      cantidadComisionesPracticas,
      JTP: JTP.trim() ? JTP : null,
      aux_primera: aux1.trim() ? aux1 : null,
      aux_segunda: aux2.trim() ? aux2 : null,
      respuestas: respuestasFormateadas,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/informe-catedra-completado/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosParaBackend),
      });

      if (!res.ok) throw new Error("Error al enviar el informe");

      setMensaje("Informe enviado con éxito.");
      setTimeout(() => navigate(ROUTES.INFORMES_CATEDRA_PENDIENTES), 1500);
    } catch (error) {
      console.error("Error enviando informe:", error);
      setMensaje("Error al enviar el informe.");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="bg-light">
      <div className="container-lg py-4">
        <div className="card shadow-sm">
          <div className="card-header bg-unpsjb-header">
            <h1 className="h4 text-center">
              Informe de Cátedra – {asignaturasNombre}
            </h1>
          </div>

          <div className="card-body p-4">
            <ul className="nav nav-pills nav-fill mb-4">
              {steps.map((step) => (
                <li key={step.id} className="nav-item">
                  <a
                    className={`nav-link ${currentStep === step.id ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goToStep(step.id);
                    }}
                    href="#"
                  >
                    {step.name}
                  </a>
                </li>
              ))}
            </ul>

            <ContenidoPasos
              currentStep={currentStep}
              categoriasConPreguntas={categoriasConPreguntas}
              respuestas={respuestas}
              manejarCambio={manejarCambio}
              onDatosGenerados={manejarDatosGenerados}
              nombresFuncion={{ JTP, aux1, aux2 }}
              setNombresFuncion={{ SetJTP, SetAux1, SetAux2 }}
            />
          </div>

          <div className="card-footer d-flex justify-content-between">
            <button
              onClick={prevStep}
              className="btn btn-outline-secondary"
              disabled={currentStep === 1}
            >
              Anterior
            </button>

            {currentStep < totalSteps ? (
              <button onClick={nextStep} className="btn btn-primary">
                Siguiente
              </button>
            ) : (
              <button
                onClick={enviarInforme}
                className="btn btn-success"
                disabled={enviando}
              >
                {enviando ? "Enviando..." : "Enviar Informe"}
              </button>
            )}
          </div>

          {mensaje && (
            <div className="alert alert-info text-center mt-3">{mensaje}</div>
          )}
        </div>
      </div>
    </div>
  );
}
