import { useEffect, useState, useCallback } from "react";

const API = "http://127.0.0.1:8000";

export interface EncuestaCompletada {
  id_finalizada: number;
  encuesta_id: number;
  asignatura_id: number;
  titulo: string;
  anio: number;
  duracion: string;
  ciclo_lectivo: string;
  asignatura: string;
  sede_id: number | null;
  docente: string;
}

export const useEncuestasCompletadas = (alumnoIdParam?: number) => {
  const [encuestas, setEncuestas] = useState<EncuestaCompletada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const alumnoId =
    alumnoIdParam ?? Number(localStorage.getItem("alumno_id") || "1");

  const fetchCompletadas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 Fetch completadas del alumno", alumnoId);

      const resp = await fetch(
        `${API}/encuestas/alumno/${alumnoId}/finalizadas`
      );

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        console.error("❌ Error servidor completadas:", errData);
        throw new Error(
          errData.detail || `Error ${resp.status}: ${resp.statusText}`
        );
      }

      const data = await resp.json();

      if (!Array.isArray(data)) {
        console.error("❌ Respuesta de completadas no es array:", data);
        throw new Error("Formato de respuesta inválido");
      }

      console.log("✅ completadas:", data);
      setEncuestas(data);
    } catch (e: any) {
      console.error("❌ Error completadas:", e);
      setError(e.message || "Error al cargar encuestas completadas");
      setEncuestas([]);
    } finally {
      setLoading(false);
    }
  }, [alumnoId]);

  useEffect(() => {
    fetchCompletadas();
  }, [fetchCompletadas]);

  return { encuestas, loading, error, refetch: fetchCompletadas };
};
