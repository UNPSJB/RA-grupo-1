import { useState } from "react";
import TablaDatosEstadisticos from "./TablaDatosEstadisticos";

interface OpcionPorcentaje {
  opcion_id: string;
  porcentaje: number;
}

interface DatosEstadisticosPregunta {
  id_pregunta: string;
  datos: OpcionPorcentaje[];
}

export default function DatosEstadisticosPage() {
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [datos, setDatos] = useState<DatosEstadisticosPregunta[]>([]);
  const [loading, setLoading] = useState(false);

  const informeId = 6;
  const materiaId = 7;
  const anio = 2025;
  const periodo = "PRIMER_CUATRIMESTRE";

  const fetchDatos = async (tipo: "calculados" | "existentes") => {
    try {
      setMensaje(null);
      setDatos([]);
      setLoading(true);

      let url = "";
      if (tipo === "calculados") {
        url = `http://127.0.0.1:8000/datos_estadisticos/?id_materia=${materiaId}&anio=${anio}&periodo=${periodo}`;
      } else {
        url = `http://127.0.0.1:8000/datos_estadisticos/recuperar_existentes/${informeId}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al obtener los datos");
      const data = await res.json();
      if (data.length === 0) {
        setMensaje("No hay datos estadísticos disponibles.");
        return;
      }
      setDatos(data);
    } catch (error) {
      console.error(error);
      setMensaje("Error al obtener los datos estadísticos.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    try {
      setMensaje(null);
      setDatos([]);
      const response = await fetch(
        `http://127.0.0.1:8000/datos_estadisticos/guardar_datos/${informeId}`,
        { method: "POST" }
      );

      if (response.ok) {
        setMensaje("Datos estadísticos generados y guardados correctamente.");
      } else {
        setMensaje("Error al guardar los datos estadísticos.");
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h1 className="h4 mb-0">Datos Estadísticos</h1>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <strong>Informe ID:</strong> {informeId} <br />
            <strong>Materia ID:</strong> {materiaId} <br />
            <strong>Año:</strong> {anio} <br />
            <strong>Periodo:</strong> {periodo}
          </div>

          <div className="d-flex flex-column gap-3 mb-4">
            <button
              onClick={() => fetchDatos("calculados")}
              className="btn btn-primary"
              disabled={loading}
            >
              Calcular datos estadísticos
            </button>

            <button onClick={handleGuardar} className="btn btn-primary" disabled={loading}>
              Guardar datos estadísticos
            </button>

            <button
              onClick={() => fetchDatos("existentes")}
              className="btn btn-primary"
              disabled={loading}
            >
             Ver datos guardados
            </button>
          </div>

          {mensaje && (
            <div className="alert alert-info mt-4 text-center" role="alert">
              {mensaje}
            </div>
          )}

          {loading ? (
            <div className="text-center mt-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            datos.length > 0 && (
              <TablaDatosEstadisticos datos={datos} />
            )
          )}
        </div>
      </div>
    </div>
  );
}