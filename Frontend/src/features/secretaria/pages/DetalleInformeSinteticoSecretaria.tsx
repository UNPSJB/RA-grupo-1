// Frontend/src/features/secretaria/pages/DetalleInformeSinteticoSecretaria.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";

import InformeSinteticoPDFDocument, {
  CabeceraPDF,
  RespuestaPDF,
} from "../../departamentos/components/InformeSinteticoPDFDocument";

const API = "http://localhost:8000";

// ---------------------------------------------
// Conversor para cabecera
// ---------------------------------------------
function convertirCabecera(det: any): CabeceraPDF {
  return {
    departamentoId: det.departamento_id,
    departamentoNombre: det.departamento_nombre,
    carreraId: det.carrera_id,
    carreraNombre: det.carrera_nombre,
    sede: det.sede ?? "-",
    anio: det.anio,
    duracion: det.duracion,
  };
}

// ---------------------------------------------
// Conversor preguntas → RespuestasPDF
// ---------------------------------------------
function convertirDetalleARespuestasPDF(det: any): RespuestaPDF[] {
  return det.preguntas.map((p: any) => {
    if (p.estructura && p.estructura.tipo === "tabla") {
      return {
        preguntaId: p.id,
        codigo: p.codigo,
        enunciado: p.oracion,
        tipo: "tabla",
        tabla: Array.isArray(p.respuesta) ? p.respuesta : [],
      };
    }

    return {
      preguntaId: p.id,
      codigo: p.codigo,
      enunciado: p.oracion,
      tipo: "texto",
      texto: typeof p.respuesta === "string" ? p.respuesta : "",
    };
  });
}

// ---------------------------------------------
// PAGE
// ---------------------------------------------
export default function DetalleInformeSinteticoSecretaria() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detalle, setDetalle] = useState<any | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        setCargando(true);
        setError(null);

        const resp = await fetch(
          `${API}/informes_sinteticos_finalizados/finalizados/${id}`
        );
        if (!resp.ok) throw new Error("Error obteniendo informe");

        const data = await resp.json();
        setDetalle(data);
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar el informe.");
      } finally {
        setCargando(false);
      }
    };

    fetchDetalle();
  }, [id]);

  if (cargando) {
    return (
      <div className="container py-4">
        <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>
          Volver
        </button>
        <h3>Cargando informe...</h3>
      </div>
    );
  }

  if (error || !detalle) {
    return (
      <div className="container py-4">
        <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>
          Volver
        </button>
        <p className="text-danger">{error || "Error desconocido"}</p>
      </div>
    );
  }

  // Conversión a PDF
  const cabeceraPDF = convertirCabecera(detalle);
  const respuestasPDF = convertirDetalleARespuestasPDF(detalle);

  return (
    <div className="container-fluid py-3">

      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        Volver
      </button>

      <h3 className="mb-3">{detalle.titulo}</h3>
      <p className="text-muted mb-3">
        Informe N.º {detalle.id} — {detalle.anio}, {detalle.duracion}
      </p>

      <div style={{ border: "1px solid #ccc", height: "90vh" }}>
        <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
          <InformeSinteticoPDFDocument
            informeId={detalle.id}
            titulo={detalle.titulo}
            cabecera={cabeceraPDF}
            respuestas={respuestasPDF}
          />
        </PDFViewer>
      </div>
    </div>
  );
}
