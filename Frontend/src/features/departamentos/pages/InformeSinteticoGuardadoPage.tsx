// Frontend/src/features/departamentos/pages/InformeSinteticoGuardadoPage.tsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InformeSinteticoPDFDocument, {
  CabeceraPDF,
  RespuestaPDF,
} from "../components/InformeSinteticoPDFDocument";
import type { PreguntaInformeSintetico } from "../hooks/usePreguntasInformeSintetico";

interface LocationState {
  informeId: number;
  titulo: string;
  cabecera: {
    departamento_id: number;
    carrera_id: number;
    sede: string;
    anio: number | string;
    duracion: string; // "anual" / "cuatrimestre_1" / etc (normalizado)
  };
  preguntas: PreguntaInformeSintetico[];
  respuestas: { [preguntaId: string]: string };
}

export default function InformeSinteticoGuardadoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  // Si recargan la página perdemos el state.
  if (!state) {
    return (
      <div className="container mt-4">
        <h2>Informe sintético guardado</h2>
        <p>
          El informe con ID <strong>{id}</strong> fue guardado correctamente.
        </p>
        <p>
          Para generar el PDF desde esta vista necesitás entrar nuevamente desde
          el flujo de guardado (por ahora usamos datos en memoria del navegador).
        </p>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/departamento")}
        >
          Volver al menú
        </button>
      </div>
    );
  }

  const { informeId, titulo, cabecera, preguntas, respuestas } = state;

const cabeceraPdf: CabeceraPDF = {
  departamentoId: cabecera.departamento_id,
  departamentoNombre: cabecera.departamento_nombre,
  carreraId: cabecera.carrera_id,
  carreraNombre: cabecera.carrera_nombre,
  sede: cabecera.sede,
  anio: Number(cabecera.anio),
  duracion: cabecera.duracion,
};


  // Armamos respuestas para el PDF
  const respuestasPdf: RespuestaPDF[] = preguntas.map((p) => {
    let estructura: any = null;
    try {
      estructura = p.estructura ? JSON.parse(p.estructura) : null;
    } catch {
      estructura = null;
    }

    const raw = respuestas[p.id] ?? "";

    // si la pregunta es tabla, raw es un JSON string con un array
    if (estructura?.tipo === "tabla") {
      let tabla: any[] = [];
      try {
        const parsed = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed)) tabla = parsed;
      } catch {
        tabla = [];
      }

      return {
        preguntaId: p.id,
        codigo: p.codigo ?? undefined,
        enunciado: p.oracion,
        tipo: "tabla",
        tabla,
      };
    }

    // texto
    return {
      preguntaId: p.id,
      codigo: p.codigo ?? undefined,
      enunciado: p.oracion,
      tipo: "texto",
      texto: raw,
    };
  });

  return (
    <div className="container mt-4">
      <h2>Informe sintético guardado correctamente</h2>
      <p className="text-muted">
        ID de informe: <strong>{informeId}</strong>
      </p>

      <div className="mt-3 mb-4 d-flex gap-2 flex-wrap">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/departamento")}
        >
          Volver al menú
        </button>

        <PDFDownloadLink
          document={
            <InformeSinteticoPDFDocument
              informeId={informeId}
              titulo={titulo}
              cabecera={cabeceraPdf}
              respuestas={respuestasPdf}
            />
          }
          fileName={`informe_sintetico_${informeId}.pdf`}
          className="btn btn-success"
        >
          {({ loading }) =>
            loading ? "Generando PDF..." : "Descargar informe en PDF"
          }
        </PDFDownloadLink>
      </div>

      <hr />

      <p>
        Podés volver al menú o descargar el informe sintético tal como fue
        cargado en esta sesión.
      </p>
    </div>
  );
}