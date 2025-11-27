import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  usePreguntasInformeSintetico,
  type PreguntaInformeSintetico,
} from "../hooks/usePreguntasInformeSintetico";

import TablaDinamica from "../components/TablaDinamica";

const API = "http://localhost:8000";

/**
 * Leemos del localStorage la carrera seleccionada y el departamento.
 * Lo hacemos fuera del componente porque:
 * - No hay SSR en tu caso (Vite SPA).
 * - Es info estática de contexto, no cambia mientras estás en esta pantalla.
 */
const carreraSeleccionada = (() => {
  try {
    const raw = localStorage.getItem("carreraSeleccionada");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const departamento = (() => {
  try {
    const raw = localStorage.getItem("departamento");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

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

  const [cabecera, setCabecera] = useState<CabeceraInformeSintetico | null>(
    null
  );
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

  const { preguntas, loading, error } =
    usePreguntasInformeSintetico(informeBaseId);

  const handleChangeRespuesta = (preguntaId: number, texto: string) => {
    const nuevas: RespuestasMapa = {
      ...respuestas,
      [preguntaId]: texto,
    };

    setRespuestas(nuevas);
    localStorage.setItem(
      "respuestas_informe_sintetico",
      JSON.stringify(nuevas)
    );
  };

  const normalizarDuracion = (d: string) => {
    switch (d) {
      case "ANUAL":
       return "anual";
      case "PRIMER CUATRIMESTRE":
        return "primer_cuatrimestre";
      case "SEGUNDO CUATRIMESTRE":
       return "segundo_cuatrimestre";
     default:
        return d.toLowerCase();
    }
  };


  const handleGuardarInforme = async () => {
    if (!cabecera || !informeBaseId) {
      alert("Faltan datos de cabecera o informe base.");
      return;
    }

    try {
      const { carrera_id, anio, duracion } = cabecera;

      const cuerpo = {
        titulo: `Informe Sintético ${anio}`,
        contenido: "",
        anio: Number(anio),
        duracion: normalizarDuracion(duracion),
        informe_base_id: informeBaseId,
        carrera_id,
        respuestas: preguntas.map((p: PreguntaInformeSintetico) => ({
          pregunta_id: p.id,
          texto_respuesta: respuestas[p.id] || "",
          asignatura_id: 0,
        })),
      };

      const resp = await fetch(
        `${API}/informes_sinteticos_finalizados/finalizados/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cuerpo),
        }
      );

      if (!resp.ok) {
        console.error(await resp.text());
        alert("Error al guardar el informe sintético.");
        return;
      }

      const data = await resp.json(); // debería traer al menos { id: ... }

      // Limpiar localStorage
      localStorage.removeItem("respuestas_informe_sintetico");
      localStorage.removeItem("cabecera_informe_sintetico");
      localStorage.removeItem("informe_sintetico_base_id");

      alert("Informe sintético guardado correctamente.");

      // Ir a la página de “guardado” con todos los datos necesarios para el PDF
      navigate(`/departamento/informe-sintetico/guardado/${data.id}`, {
        state: {
          informeId: data.id,
          titulo: cuerpo.titulo,
          cabecera: {
            ...cabecera,
            duracion: normalizarDuracion(duracion), // ya normalizada
            departamento_nombre: departamento?.nombre || "Departamento",
            carrera_nombre: carreraSeleccionada?.nombre || "Carrera",
          },
          preguntas,
          respuestas,
        },
      });
    } catch (e) {
      console.error(e);
      alert("Error inesperado al guardar el informe sintético.");
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
              <strong>Ciclo lectivo / duración:</strong> {cabecera.anio} —{" "}
              {cabecera.duracion}
            </p>
            <p className="mb-1">
              <strong>Sede:</strong> {cabecera.sede}
            </p>
            <p className="mb-1">
              <strong>Departamento:</strong>{" "}
              {departamento?.nombre || `ID ${cabecera.departamento_id}`}
            </p>
            <p className="mb-1">
              <strong>Carrera:</strong>{" "}
              {carreraSeleccionada?.nombre || `ID ${cabecera.carrera_id}`}
            </p>
          </div>

          {/* Preguntas */}
          {loading && <p>Cargando preguntas...</p>}
          {error && <p className="text-danger">Error: {error}</p>}

          {!loading && (
            <div className="d-flex flex-column gap-4">
              {preguntas.map((p) => {
                // PARSE SEGURO DE ESTRUCTURA
                let estructura: any = null;
                try {
                  estructura = p.estructura ? JSON.parse(p.estructura) : null;
                } catch {
                  estructura = null;
                }

                // INICIALIZAR UNA FILA VACÍA SI ES TABLA Y NO HAY RESPUESTAS
                if (estructura?.tipo === "tabla" && !respuestas[p.id]) {
                  const primeraFila = [
                    Object.fromEntries(
                      estructura.columnas.map((c: any) => [c.id, ""])
                    ),
                  ];
                  handleChangeRespuesta(p.id, JSON.stringify(primeraFila));
                }

                // separar título y aclaración usando el mismo string de la pregunta
                const lineas = (p.oracion || "").split("\n");
                const textoPrincipal = lineas[0] || "";
                const textoAclaracion =
                  lineas.length > 1 ? lineas.slice(1).join("\n") : null;

                return (
                  <div
                    key={p.id}
                    className="p-3 border rounded bg-white shadow-sm"
                    style={{ width: "100%" }}
                  >
                    {/* X. PREGUNTA (mismo color que el resto, solo negrita y subrayado) */}
                    <p
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                        marginBottom: 4,
                      }}
                    >
                      {p.codigo}.
                    </p>

                    {/* Texto principal (primera línea) */}
                    <p
                      className="mb-1"
                      style={{ fontSize: 14, fontWeight: 600 }}
                    >
                      {textoPrincipal}
                    </p>

                    {/* Aclaración (segunda línea en adelante, si existe) */}
                    {textoAclaracion && (
                      <p
                        className="mb-2"
                        style={{
                          fontSize: 13,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {textoAclaracion}
                      </p>
                    )}

                    {/* Campo de respuesta: tabla o textarea */}
                    {estructura?.tipo === "tabla" ? (
                      <TablaDinamica
                        estructura={estructura}
                        value={respuestas[p.id]}
                        onChange={(val: string) =>
                          handleChangeRespuesta(p.id, val)
                        }
                      />
                    ) : (
                      <textarea
                        className="form-control"
                        rows={3}
                        value={respuestas[p.id] || ""}
                        onChange={(e) =>
                          handleChangeRespuesta(p.id, e.target.value)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

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