// Frontend/src/features/departamentos/pages/InformeSinteticoHistoricosPage.tsx

import { useEffect, useState } from "react";
import InformeSinteticoPDFDocument, {
  CabeceraPDF,
  RespuestaPDF,
} from "../components/InformeSinteticoPDFDocument";

const API = "http://localhost:8000";

type InformeSinteticoResumen = {
  id: number;
  titulo: string;
  anio: number;
  duracion: string;
  sede?: string;
  departamento_id: number;
  departamento_nombre?: string;
  carrera_id: number;
  carrera_nombre?: string;
};

// ---------------------------------------------------------------
// Conversor de duraciones del backend a texto legible
// ---------------------------------------------------------------
const formatDuracion = (d: string) => {
  switch (d.toLowerCase()) {
    case "anual":
      return "Anual";
    case "primer_cuatrimestre":
      return "1er Cuatrimestre";
    case "segundo_cuatrimestre":
      return "2do Cuatrimestre";
    default:
      return d;
  }
};

// ---------------------------------------------------------------
// Conversor de cabecera (detalle → CabeceraPDF)
// ---------------------------------------------------------------
function convertirCabecera(detalle: any): CabeceraPDF {
  return {
    departamentoId: detalle.departamento_id,
    departamentoNombre: detalle.departamento_nombre,
    carreraId: detalle.carrera_id,
    carreraNombre: detalle.carrera_nombre,
    sede: detalle.sede,
    anio: detalle.anio,
    duracion: detalle.duracion,
  };
}

// ---------------------------------------------------------------
// Conversor de preguntas + respuestas (detalle → RespuestaPDF[])
// ---------------------------------------------------------------
function convertirDetalleARespuestasPDF(detalle: any): RespuestaPDF[] {
  return detalle.preguntas.map((p: any) => {
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

// ---------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------
export default function InformeSinteticoHistoricosPage() {
  const [informes, setInformes] = useState<InformeSinteticoResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar lista de informes
  useEffect(() => {
    const fetchInformes = async () => {
      try {
        setLoading(true);
        setError(null);

        const resp = await fetch(
          `${API}/informes_sinteticos_finalizados/finalizados/`
        );
        if (!resp.ok) throw new Error(await resp.text());

        const data = await resp.json();
        setInformes(data);
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar los informes históricos.");
      } finally {
        setLoading(false);
      }
    };

    fetchInformes();
  }, []);

  if (loading) {
    return (
      <div className="container py-4">
        <h2>Históricos — Informes Sintéticos</h2>
        <p>Cargando informes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <h2>Históricos — Informes Sintéticos</h2>
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (informes.length === 0) {
    return (
      <div className="container py-4">
        <h2>Históricos — Informes Sintéticos</h2>
        <p>No hay informes sintéticos finalizados registrados.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3">Históricos — Informes Sintéticos</h2>
      <p className="text-muted mb-4">
        Listado de todos los informes sintéticos finalizados.
      </p>

      <div className="d-flex flex-column gap-3">
        {informes.map((inf) => {
          return (
            <div
              key={inf.id}
              className="p-3 border rounded bg-white shadow-sm d-flex justify-content-between align-items-center flex-wrap gap-2"
            >
              <div>
                <h5 className="mb-1">{inf.titulo}</h5>

                <small className="d-block text-muted">
                  Año: {inf.anio} — Ciclo: {formatDuracion(inf.duracion)}
                </small>

                <small className="d-block text-muted">
                  Departamento:{" "}
                  {inf.departamento_nombre || `ID ${inf.departamento_id}`}
                </small>

                <small className="d-block text-muted">
                  Carrera: {inf.carrera_nombre || `ID ${inf.carrera_id}`}
                </small>

                <small className="d-block text-muted">
                  Sede: {inf.sede || "-"}
                </small>

                <small className="d-block text-muted">
                  Informe N.º {inf.id}
                </small>
              </div>

              <div>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={async () => {
                    try {
                      // 1. Traer INFORME COMPLETO
                      const resp = await fetch(
                        `${API}/informes_sinteticos_finalizados/finalizados/${inf.id}`
                      );
                      if (!resp.ok)
                        throw new Error("Error obteniendo informe completo");

                      const detalle = await resp.json();

                      // 2. Convertir cabecera
                      const cabeceraPdf = convertirCabecera(detalle);

                      // 3. Convertir preguntas + respuestas
                      const respuestasPdf =
                        convertirDetalleARespuestasPDF(detalle);

                      // 4. Generar PDF
                      const { pdf } = await import("@react-pdf/renderer");
                      const element = (
                        <InformeSinteticoPDFDocument
                          informeId={detalle.id}
                          titulo={detalle.titulo}
                          cabecera={cabeceraPdf}
                          respuestas={respuestasPdf}
                        />
                      );
                      const blob = await pdf(element).toBlob();

                      // 5. Descargar
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = `informe_sintetico_${inf.id}.pdf`;
                      a.click();
                    } catch (err) {
                      console.error(err);
                      alert("Error generando PDF");
                    }
                  }}
                >
                  Descargar PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
