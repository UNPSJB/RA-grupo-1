// Frontend/src/features/secretaria/pages/DetalleInformeSinteticoSecretaria.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import InformeSinteticoPDFDocument, {
  CabeceraPDF,
  RespuestaPDF,
} from "../../departamentos/components/InformeSinteticoPDFDocument";
import InformeSinteticoHTML from "../components/InformeSinteticoHTML";

import { pdf } from "@react-pdf/renderer";

const API = "http://localhost:8000";

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

function convertirRespuestas(det: any): RespuestaPDF[] {
  return det.preguntas.map((p: any) => {
    if (p.estructura?.tipo === "tabla") {
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

export default function DetalleInformeSinteticoSecretaria() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [detalle, setDetalle] = useState<any | null>(null);
  const [cabeceraPDF, setCabeceraPDF] = useState<CabeceraPDF | null>(null);
  const [respuestasPDF, setRespuestasPDF] = useState<RespuestaPDF[]>([]);

  useEffect(() => {
    const fetchDetalle = async () => {
      if (!id) return;
      const resp = await fetch(
        `${API}/informes_sinteticos_finalizados/finalizados/${id}`
      );
      const data = await resp.json();

      setDetalle(data);
      setCabeceraPDF(convertirCabecera(data));
      setRespuestasPDF(convertirRespuestas(data));
    };

    fetchDetalle();
  }, [id]);

  if (!detalle || !cabeceraPDF) {
    return <p>Cargando informe...</p>;
  }

  const handleDescargarPDF = async () => {
    const element = (
      <InformeSinteticoPDFDocument
        informeId={detalle.id}
        titulo={detalle.titulo}
        cabecera={cabeceraPDF}
        respuestas={respuestasPDF}
      />
    );

    const blob = await pdf(element).toBlob();

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `informe_sintetico_${detalle.id}.pdf`;
    a.click();
  };

  return (
    <div className="container py-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        Volver
      </button>

      <InformeSinteticoHTML
        titulo={detalle.titulo}
        cabecera={cabeceraPDF}
        respuestas={respuestasPDF}
      />

      <div className="text-center mt-4 mb-5">
        <button className="btn btn-primary" onClick={handleDescargarPDF}>
          Descargar PDF
        </button>
      </div>
    </div>
  );
}
