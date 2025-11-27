// Frontend/src/features/departamentos/pages/InformeSinteticoHistoricosPage.tsx
import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
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

export default function InformeSinteticoHistoricosPage() {
  const [informes, setInformes] = useState<InformeSinteticoResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInformes = async () => {
      try {
        setLoading(true);
        setError(null);

        const resp = await fetch(
          `${API}/informes_sinteticos_finalizados/finalizados/`
        );
        if (!resp.ok) {
          throw new Error(await resp.text());
        }

        const data = await resp.json();
        setInformes(data);
      } catch (e: any) {
        console.error(e);
        setError("No se pudieron cargar los informes históricos.");
      } finally {
        setLoading(false);
      }
    };

    fetchInformes();
  }, []);

  const formatDuracion = (d: string) => {
    switch (d) {
      case "anual":
        return "Anual";
      case "cuatrimestre_1":
        return "Primer cuatrimestre";
      case "cuatrimestre_2":
        return "Segundo cuatrimestre";
      default:
        return d;
    }
  };

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
        Listado todos los informes sintéticos finalizados.
      </p>

      <div className="d-flex flex-column gap-3">
        {informes.map((inf) => {
          // Cabecera mínima para el PDF (por ahora solo encabezado)
          const cabeceraPdf: CabeceraPDF = {
            departamentoId: inf.departamento_id,
            departamentoNombre:
              inf.departamento_nombre || `ID ${inf.departamento_id}`,
            carreraId: inf.carrera_id,
            carreraNombre: inf.carrera_nombre || `ID ${inf.carrera_id}`,
            sede: inf.sede || "-",
            anio: inf.anio,
            duracion: inf.duracion,
          };

          // Desde históricos todavía no traemos las respuestas.
          // Más adelante se puede usar un endpoint de detalle para llenarlo.
          const respuestasPdf: RespuestaPDF[] = [];

          return (
            <div
              key={inf.id}
              className="p-3 border rounded bg-white shadow-sm d-flex justify-content-between align-items-center flex-wrap gap-2"
            >
              <div>
                {/* Título del informe */}
                <h5 className="mb-1">{inf.titulo}</h5>

                {/* Año + ciclo */}
                <small className="d-block text-muted">
                  Año: {inf.anio} — Ciclo: {formatDuracion(inf.duracion)}
                </small>

                {/* Departamento */}
                <small className="d-block text-muted">
                  Departamento:{" "}
                  {inf.departamento_nombre || `ID ${inf.departamento_id}`}
                </small>

                {/* Carrera */}
                <small className="d-block text-muted">
                  Carrera: {inf.carrera_nombre || `ID ${inf.carrera_id}`}
                </small>

                {/* Sede */}
                <small className="d-block text-muted">
                  Sede: {inf.sede || "-"}
                </small>

                {/* Número de informe */}
                <small className="d-block text-muted">
                  Informe N.º {inf.id}
                </small>
              </div>

              <div>
                <PDFDownloadLink
                  document={
                    <InformeSinteticoPDFDocument
                      informeId={inf.id}
                      titulo={inf.titulo}
                      cabecera={cabeceraPdf}
                      respuestas={respuestasPdf}
                    />
                  }
                  fileName={`informe_sintetico_${inf.id}.pdf`}
                  className="btn btn-outline-primary btn-sm"
                >
                  {({ loading }) =>
                    loading ? "Generando PDF..." : "Descargar PDF"
                  }
                </PDFDownloadLink>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
