import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  usePreguntasInformeSintetico,
  type PreguntaInformeSintetico,
} from "../hooks/usePreguntasInformeSintetico";

import TablaDinamica from "../components/TablaDinamica";

const API = "http://localhost:8000";

type CabeceraInformeSintetico = {
  departamento_id: number;
  carrera_id: number;
  sede: string;
  anio: number | string;
  duracion: string;
};

type RespuestasMapa = {
  [preguntaId: string]: string;
};

export default function InformeSinteticoPreguntasPage() {
  const navigate = useNavigate();

  const [cabecera, setCabecera] = useState<CabeceraInformeSintetico | null>(null);
  const [informeBaseId, setInformeBaseId] = useState<number | null>(null);

  const [respuestas, setRespuestas] = useState<RespuestasMapa>(() => {
    try {
      const raw = localStorage.getItem("respuestas_informe_sintetico");
      if (!raw) return {};
      return JSON.parse(raw);
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const rawCabecera = localStorage.getItem("cabecera_informe_sintetico");
    if (rawCabecera) {
      try {
        setCabecera(JSON.parse(rawCabecera));
      } catch (e) {
        console.error("Error parseando cabecera:", e);
      }
    }

    const rawInformeBaseId = localStorage.getItem("informe_sintetico_base_id");
    if (rawInformeBaseId) {
      setInformeBaseId(Number(rawInformeBaseId));
    }
  }, []);

  const { preguntas, loading, error } = usePreguntasInformeSintetico(informeBaseId);

  const handleChangeRespuesta = (preguntaId: number, texto: string) => {
    const nuevas: RespuestasMapa = {
      ...respuestas,
      [preguntaId]: texto,
    };

    setRespuestas(nuevas);
    localStorage.setItem("respuestas_informe_sintetico", JSON.stringify(nuevas));
  };

const handleGuardarInforme = async () => {
  if (!cabecera || !informeBaseId) {
    alert("Faltan datos de cabecera o informe base. Volvé al paso anterior.");
    return;
  }

  const { carrera_id, anio, duracion } = cabecera;

  const cuerpo = {
    titulo: `Informe Sintético ${anio}`,
    contenido: "",
    anio: Number(anio),
    duracion,
    informe_base_id: informeBaseId,
    carrera_id,
    respuestas: preguntas.map((p: PreguntaInformeSintetico) => ({
      pregunta_id: p.id,
      texto_respuesta: respuestas[p.id] || "",
      asignatura_id: 0,
    })),
  };

  try {
    const res = await fetch(
      `${API}/informes_sinteticos_finalizados/finalizados/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Error al guardar:", text);
      alert("Error al guardar el informe sintético.");
      return;
    }

    // ✔ INFORME CREADO
    const data = await res.json();

    // ✔ PDF
    window.open(
      `${API}/informes_sinteticos_finalizados/${data.id}/pdf`,
      "_blank"
    );

    // ✔ LIMPIAR TEMPORAL
    localStorage.removeItem("respuestas_informe_sintetico");
    localStorage.removeItem("cabecera_informe_sintetico");
    localStorage.removeItem("informe_sintetico_base_id");

    alert("Informe sintético guardado correctamente.");

    // ✔ NAVEGAR
    navigate("/departamento");

  } catch (e) {
    console.error("Error de red:", e);
    alert("Error de red al guardar el informe sintético.");
  }
};


  if (!cabecera) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          No se encontró la cabecera del informe. Volvé al paso anterior.
        </div>
        <button
          className="btn btn-secondary mt-2"
          onClick={() => navigate("/departamento/informe-sintetico/cabecera")}
        >
          Volver a cabecera
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="h4 mb-0">Informe Sintético — Preguntas</h2>
        </div>

        <div className="card-body">

          {/* Cabecera resumida */}
          <div className="mb-4 p-3 border rounded bg-light">
            <p className="mb-1">
              <strong>Ciclo lectivo / duración:</strong> {cabecera.anio} — {cabecera.duracion}
            </p>
            <p className="mb-1">
              <strong>Sede:</strong> {cabecera.sede}
            </p>
            <p className="mb-1">
              <strong>Carrera ID:</strong> {cabecera.carrera_id}
            </p>
          </div>

          {/* Preguntas */}
          {loading && <p>Cargando preguntas...</p>}
          {error && <p className="text-danger">Error: {error}</p>}

          {!loading &&
            preguntas.map((p) => {
              // ----------------------------------------
              // NUEVO: PARSE SEGURO DE ESTRUCTURA
              // ----------------------------------------
              let estructura = null;
              try {
                estructura = p.estructura ? JSON.parse(p.estructura) : null;
              } catch {
                estructura = null;
              }

              // ----------------------------------------
              // NUEVO: INICIALIZAR [] SI ES TABLA
              // ----------------------------------------
              if (estructura?.tipo === "tabla" && !respuestas[p.id]) {
                handleChangeRespuesta(p.id, "[]");
              }

              return (
                <div key={p.id} className="mb-4 p-3 border rounded bg-white shadow-sm">
                  <label className="form-label fw-bold mb-2">
                    {p.codigo}) {p.oracion}
                  </label>

                  {estructura?.tipo === "tabla" ? (
                    <TablaDinamica
                      estructura={estructura}
                      value={respuestas[p.id]}
                      onChange={(val: string) => handleChangeRespuesta(p.id, val)}
                    />
                  ) : (
                    <textarea
                      className="form-control"
                      rows={3}
                      value={respuestas[p.id] || ""}
                      onChange={(e) => handleChangeRespuesta(p.id, e.target.value)}
                    />
                  )}
                </div>
              );
            })}

          {/* Guardar */}
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-success" onClick={handleGuardarInforme}>
              Guardar Informe
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
