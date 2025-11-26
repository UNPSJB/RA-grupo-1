import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import ROUTES from "../../../paths";
import ContenidoPasos from "../../docente/informe/ContenidoPasos";

interface Categoria {
  id: number;
  texto: string;
  cod: string;
}

interface Pregunta {
  id: number;
  enunciado: string;
  tipo: string;
  categoria_id: number;
  categoria: Categoria;
}

interface RespuestaConPregunta {
  id: number;
  texto_respuesta: string | null;
  opcion_id: number | null;
  pregunta: Pregunta;
}

interface InformeCompletadoDetalle {
  id: number;
  titulo: string | null;
  contenido: string | null;
  anio: number | null;
  periodo: string | null;
  respuestas_informe: RespuestaConPregunta[];
  cantidadAlumnos: number;
  cantidadComisionesTeoricas: number;
  cantidadComisionesPracticas: number;
  JTP: string | null;
  aux_primera: string | null;
  aux_segunda: string | null;
  asignaturasNombre?: string;
  asignaturasCodigo?: string;
  sede?: string;
  docenteResponsable?: string;
  asignaturasId: number;
  docente_asignaturas_id: number;
  informe_catedra_base_id: number;
}

interface CategoriaConPreguntas {
  id: number;
  cod: string;
  texto: string;
  preguntas: Pregunta[];
}

type RespuestaValor = {
  opcion_id: number | null;
  texto_respuesta: string | null;
};

export function mostrarPeriodo(periodo: string) {
  switch (periodo) {
    case "PRIMER_CUATRI":
      return "Primer Cuatrimestre";
    case "SEGUNDO_CUATRI":
      return "SegundoCuatrimestre";
    case "ANUAL":
      return "Anual";
    default:
      return periodo;
  }
}

export default function InformeCatedraDetalle() {
  const { id } = useParams<{ id: string }>();
  const [informe, setInforme] = useState<InformeCompletadoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [datosEstadisticos, setDatosEstadisticos] = useState<any[]>([]);
  const [cantidad, setCantidad] = useState<number>(0);
  const [gruposBase, setGruposBase] = useState<CategoriaConPreguntas[]>([]);

  const steps = [
    { id: 1, name: "Datos Generales" },
    { id: 2, name: "Datos Estadísticos" },
    { id: 3, name: "1. Recursos" },
    { id: 4, name: "2. Desarrollo Curricular" },
    { id: 5, name: "3. Actividades del Equipo" },
    { id: 6, name: "4. Valoración" },
  ];

  const goToStep = (stepId: number) => {
    setCurrentStep(stepId);
  };

  useEffect(() => {
    if (!id) {
      setError("ID de informe no proporcionado");
      setLoading(false);
      return;
    }

    const fetchInforme = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/informe-catedra-completado/${id}`
        );
        if (!res.ok) throw new Error("Error al obtener el informe");
        const dataInforme: InformeCompletadoDetalle = await res.json();

        setInforme(dataInforme);

        if (dataInforme.informe_catedra_base_id) {
          const resBase = await fetch(
            `http://127.0.0.1:8000/informes_catedra/${dataInforme.informe_catedra_base_id}/categorias_con_preguntas`
          );
          if (!resBase.ok)
            throw new Error(
              "No se pudo cargar la estructura base del informe."
            );

          const dataBase: CategoriaConPreguntas[] = await resBase.json();
          const dataOrdenada = [...dataBase].sort((a, b) =>
            a.cod.localeCompare(b.cod, "es", { sensitivity: "base" })
          );

          dataOrdenada.forEach((grupo) => {
            grupo.preguntas.sort((a, b) => a.id - b.id);
          });

          setGruposBase(dataOrdenada);
        }

        const { asignaturasId, anio, periodo } = dataInforme;

        fetch(
          `http://127.0.0.1:8000/datos_estadisticos/?id_asignaturas=${asignaturasId}&anio=${anio}&periodo=${periodo}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data && data.length > 0) {
              const dataOrdenada = [...data].sort((a, b) =>
                a.categoria_cod.localeCompare(b.categoria_cod, "es", {
                  sensitivity: "base",
                })
              );
              setDatosEstadisticos(dataOrdenada);
            }
          })
          .catch((error) =>
            console.error("Error fetching datos estadísticos:", error)
          );

        fetch(
          `http://127.0.0.1:8000/datos_estadisticos/cantidad_encuestas_completadas?id_asignaturas=${asignaturasId}&anio=${anio}&periodo=${periodo}`
        )
          .then((res) => res.json())
          .then((data) => setCantidad(data))
          .catch((error) =>
            console.error("Error fetching cantidad encuestas:", error)
          );
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInforme();
  }, [id]);

  const respuestasFormateadas = useMemo((): Record<number, RespuestaValor> => {
    if (!informe) return {};
    const mapaRespuestas: Record<number, RespuestaValor> = {};

    for (const r of informe.respuestas_informe) {
      mapaRespuestas[r.pregunta.id] = {
        opcion_id: r.opcion_id,
        texto_respuesta: r.texto_respuesta,
      };
    }
    return mapaRespuestas;
  }, [informe]);

  const datosGenerales = useMemo(() => {
    if (!informe) return {};
    return {
      cicloLectivo: informe.anio ?? undefined,
      periodo: informe.periodo ?? undefined,
      cantidadAlumnos: informe.cantidadAlumnos,
      cantidadComisionesTeoricas: informe.cantidadComisionesTeoricas,
      cantidadComisionesPracticas: informe.cantidadComisionesPracticas,
      JTP: informe.JTP,
      aux1: informe.aux_primera,
      aux2: informe.aux_segunda,
      actividadCurricular: informe.asignaturasNombre,
      codigoActividadCurricular: informe.asignaturasCodigo,
      sede: informe.sede,
      docenteResponsable: informe.docenteResponsable,
    };
  }, [informe]);

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <Link to={ROUTES.INFORMES_CATEDRA} className="btn btn-outline-danger">
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }
  if (!informe) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning" role="alert">
          No se encontró el informe solicitado.
        </div>
        <Link to={ROUTES.INFORMES_CATEDRA} className="btn btn-secondary">
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-light">
      <div className="container-lg py-4">
        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-header bg-unpsjb-header">
            <h1 className="h4 mb-0 text-center">
              {informe.titulo || "Informe de Cátedra"}
            </h1>
          </div>

          <div className="card-body p-4 p-md-5">
            <ul className="nav nav-pills nav-fill mb-4">
              {steps.map((step) => (
                <li key={step.id} className="nav-item">
                  <a
                    className={`nav-link ${
                      currentStep === step.id ? "active" : "text-muted"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      goToStep(step.id);
                    }}
                    href="#"
                    style={{ cursor: "pointer", fontWeight: 500 }}
                  >
                    {step.name}
                  </a>
                </li>
              ))}
            </ul>

            <div
              className="step-content-container"
              style={{
                height: "500px",
                overflowY: "auto",
                paddingRight: "15px",
              }}
            >
              <ContenidoPasos
                currentStep={currentStep}
                isReadOnly={true}
                categoriasConPreguntas={gruposBase}
                respuestas={respuestasFormateadas}
                datosEstadisticos={datosEstadisticos}
                cantidad={cantidad}
                docenteasignaturasId={informe.docente_asignaturas_id}
                datosIniciales={datosGenerales}
                manejarCambio={() => {}}
                onDatosGenerados={() => {}}
                nombresFuncion={{
                  JTP: informe.JTP,
                  aux1: informe.aux_primera,
                  aux2: informe.aux_segunda,
                }}
              />
            </div>
          </div>

          <div className="card-footer bg-white border-0 rounded-bottom-3 p-4">
            <div className="d-flex justify-content-between">
              <Link
                to={ROUTES.INFORMES_CATEDRA}
                className="btn btn-outline-secondary rounded-pill px-4"
              >
                Volver al listado
              </Link>
              <button
                className="btn btn-theme-primary rounded-pill px-4"
                onClick={() => goToStep(currentStep + 1)}
                disabled={currentStep === steps.length}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}