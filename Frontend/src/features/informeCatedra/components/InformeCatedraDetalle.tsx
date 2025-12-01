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
  duracion: string | null;
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
  codigo: string;
  texto: string;
  preguntas: Pregunta[];
}

type RespuestaValor = {
  opcion_id: number | null;
  texto_respuesta: string | null;
};

export default function InformeCatedraDetalle() {
  const { id } = useParams<{ id: string }>();
  const [informe, setInforme] = useState<InformeCompletadoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [gruposBase, setGruposBase] = useState<CategoriaConPreguntas[]>([]);

  const steps = [
    { id: 1, name: "Datos Generales" },
    { id: 2, name: "1. Recursos" },
    { id: 3, name: "2. Desarrollo Curricular" },
    { id: 4, name: "3. Actividades del Equipo" },
    { id: 5, name: "4. Valoración" }
  ];

  const goToStep = (id: number) => setCurrentStep(id);

  useEffect(() => {
    if (!id) {
      setError("ID de informe no proporcionado");
      setLoading(false);
      return;
    }

    const cargar = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/informe-catedra-completado/${id}`);
        if (!res.ok) throw new Error("Error al obtener el informe");
        const dataInforme: InformeCompletadoDetalle = await res.json();

        setInforme(dataInforme);

        const resBase = await fetch(
          `http://127.0.0.1:8000/informes_catedra/${dataInforme.informe_catedra_base_id}/categorias_con_preguntas`
        );
        if (!resBase.ok) throw new Error("Error cargando la estructura base");

        const dataBase: CategoriaConPreguntas[] = await resBase.json();
        const ordenado = [...dataBase].sort((a, b) =>
          a.codigo.localeCompare(b.codigo, "es", { sensitivity: "base" })
        );

        ordenado.forEach((cat) => {
          cat.preguntas.sort((a, b) => a.id - b.id);
        });

        setGruposBase(ordenado);

      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  const respuestasFormateadas = useMemo(() => {
    if (!informe) return {};
    const map: Record<number, RespuestaValor> = {};

    informe.respuestas_informe.forEach((r) => {
      map[r.pregunta.id] = {
        opcion_id: r.opcion_id,
        texto_respuesta: r.texto_respuesta
      };
    });

    return map;
  }, [informe]);

  const datosGenerales = useMemo(() => {
    if (!informe) return {};
    return {
      cicloLectivo: informe.anio,
      duracion: informe.duracion,
      cantidadAlumnos: informe.cantidadAlumnos,
      cantidadComisionesTeoricas: informe.cantidadComisionesTeoricas,
      cantidadComisionesPracticas: informe.cantidadComisionesPracticas,
      JTP: informe.JTP,
      aux1: informe.aux_primera,
      aux2: informe.aux_segunda,
      actividadCurricular: informe.asignaturasNombre,
      codigoActividadCurricular: informe.asignaturasCodigo,
      sede: informe.sede,
      docenteResponsable: informe.docenteResponsable
    };
  }, [informe]);

  if (loading)
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  if (error)
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
        <Link to={ROUTES.INFORMES_CATEDRA} className="btn btn-outline-danger">
          Volver
        </Link>
      </div>
    );

  if (!informe)
    return (
      <div className="container py-4">
        <div className="alert alert-warning">No se encontró el informe solicitado.</div>
        <Link to={ROUTES.INFORMES_CATEDRA} className="btn btn-secondary">
          Volver
        </Link>
      </div>
    );

  return (
    <div className="bg-light">
      <div className="container-lg py-4">
        <div className="card shadow-sm">
          <div className="card-header bg-unpsjb-header">
            <h1 className="h5 mb-0 text-center">{informe.titulo}</h1>
          </div>

          <div className="card-body p-4">
            <ul className="nav nav-pills nav-fill mb-4">
              {steps.map((step) => (
                <li key={step.id} className="nav-item">
                  <a
                    href="#"
                    className={`nav-link ${currentStep === step.id ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goToStep(step.id);
                    }}
                  >
                    {step.name}
                  </a>
                </li>
              ))}
            </ul>

            <div style={{ height: "500px", overflowY: "auto", paddingRight: "15px" }}>
              <ContenidoPasos
                currentStep={currentStep}
                categoriasConPreguntas={gruposBase}
                respuestas={respuestasFormateadas}
                manejarCambio={() => {}}
                onDatosGenerados={() => {}}
                isReadOnly={true}
                nombresFuncion={{
                  JTP: informe.JTP,
                  aux1: informe.aux_primera,
                  aux2: informe.aux_segunda
                }}
                datosIniciales={datosGenerales}
              />
            </div>
          </div>

          <div className="card-footer d-flex justify-content-between">
            <Link to={ROUTES.INFORMES_CATEDRA} className="btn btn-outline-secondary">
              Volver al listado
            </Link>
            <button
              className="btn btn-theme-primary"
              disabled={currentStep === steps.length}
              onClick={() => goToStep(currentStep + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
