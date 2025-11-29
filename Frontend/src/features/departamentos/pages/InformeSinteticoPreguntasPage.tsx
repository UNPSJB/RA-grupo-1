import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  usePreguntasInformeSintetico,
  type PreguntaInformeSintetico,
} from "../hooks/usePreguntasInformeSintetico";

import TablaDinamica from "../components/TablaDinamica";

const API = "http://localhost:8000";

// -----------------------------------------------
// leer carreraSeleccionada
// -----------------------------------------------
const carreraSeleccionada = (() => {
  try {
    const raw = localStorage.getItem("carreraSeleccionada");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

// -----------------------------------------------
// leer departamentoSeleccionado
// -----------------------------------------------
const departamento = (() => {
  try {
    const raw = localStorage.getItem("departamentoSeleccionado");
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

  // -----------------------------------------------
  // NUEVO: nombre real del depto obtenido del backend
  // -----------------------------------------------
  const [nombreDeptoReal, setNombreDeptoReal] = useState("");

  useEffect(() => {
    if (!cabecera) return;

    fetch(`${API}/departamentos/${cabecera.departamento_id}`)
      .then((res) => res.json())
      .then((d) => setNombreDeptoReal(d.nombre))
      .catch(() => {});
  }, [cabecera]);

  // -----------------------------------------------
  // NOMBRES DINÁMICOS — SOLUCIÓN CORRECTA
  // -----------------------------------------------
  const nombreDepartamento =
    nombreDeptoReal ||
    departamento?.nombre ||
    carreraSeleccionada?.departamento_nombre ||
    (cabecera ? `ID ${cabecera.departamento_id}` : "");

  const nombreCarrera =
    carreraSeleccionada?.nombre ||
    (cabecera?.carrera_id ? `ID ${cabecera.carrera_id}` : "");

  // -----------------------------------------------
  // cargar cabecera e informeBaseId desde localStorage
  // -----------------------------------------------
  useEffect(() => {
    const rawCabecera = localStorage.getItem("cabecera_informe_sintetico");
    if (rawCabecera) {
      try {
        setCabecera(JSON.parse(rawCabecera));
      } catch (e) {
        console.error("Error parseando cabecera:", e);
      }
    }

    const rawInformeBaseId = localStorage.getItem(
      "informe_sintetico_base_id"
    );
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

  // normalizar
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

  const formatearDuracionCabecera = (d: string) => {
    switch (d) {
      case "ANUAL":
        return "Anual";
      case "PRIMER CUATRIMESTRE":
        return "1er Cuatrimestre";
      case "SEGUNDO CUATRIMESTRE":
        return "2do Cuatrimestre";
      default:
        return d;
    }
  };

  // -----------------------------------------------
  // GUARDAR INFORME
  // -----------------------------------------------
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

      const data = await resp.json();

      // limpiar localStorage
      localStorage.removeItem("respuestas_informe_sintetico");
      localStorage.removeItem("cabecera_informe_sintetico");
      localStorage.removeItem("informe_sintetico_base_id");

      alert("Informe sintético guardado correctamente.");

      // navegar a pantalla de éxito
      navigate(`/departamento/informe-sintetico/guardado/${data.id}`, {
        state: {
          informeId: data.id,
          titulo: cuerpo.titulo,
          cabecera: {
            ...cabecera,
            duracion: normalizarDuracion(duracion),
            departamento_nombre: nombreDepartamento,
            carrera_nombre: nombreCarrera,
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

  // -----------------------------------------------
  // si falta cabecera
  // -----------------------------------------------
  if (!cabecera) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          No se encontró la cabecera del informe. Volvé al paso anterior.
        </div>
        <button
          className="btn btn-secondary mt-2"
          onClick={() =>
            navigate("/departamento/informe-sintetico/cabecera")
          }
        >
          Volver a cabecera
        </button>
      </div>
    );
  }

  // -----------------------------------------------
  // render
  // -----------------------------------------------
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
              <strong>Año - Ciclo lectivo:</strong> {cabecera.anio} —{" "}
              {formatearDuracionCabecera(String(cabecera.duracion))}
            </p>
            <p className="mb-1">
              <strong>Sede:</strong> {cabecera.sede}
            </p>
            <p className="mb-1">
              <strong>Departamento:</strong> {nombreDepartamento}
            </p>
            <p className="mb-1">
              <strong>Carrera:</strong> {nombreCarrera}
            </p>
          </div>

          {loading && <p>Cargando preguntas...</p>}
          {error && <p className="text-danger">Error: {error}</p>}

          {!loading && (
            <div className="d-flex flex-column gap-4">
              {preguntas.map((p) => {
                let estructura: any = null;
                try {
                  estructura = p.estructura ? JSON.parse(p.estructura) : null;
                } catch {
                  estructura = null;
                }

                if (estructura?.tipo === "tabla" && !respuestas[p.id]) {
                  const primeraFila = [
                    Object.fromEntries(
                      estructura.columnas.map((c: any) => [c.id, ""])
                    ),
                  ];
                  handleChangeRespuesta(p.id, JSON.stringify(primeraFila));
                }

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
                    <p
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                        marginBottom: 4,
                      }}
                    >
                      {p.codigo}.
                    </p>

                    <p
                      className="mb-1"
                      style={{ fontSize: 14, fontWeight: 600 }}
                    >
                      {textoPrincipal}
                    </p>

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
