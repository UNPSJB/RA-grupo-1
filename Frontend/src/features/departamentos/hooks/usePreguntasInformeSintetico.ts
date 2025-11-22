//usePreguntasInformeSintetico.ts
import { useEffect, useState } from "react";

export interface PreguntaInformeSintetico {
  id: number;
  codigo: string;
  oracion: string;
  orden: number;
  informe_base_id: number;
}

const API = "http://localhost:8000";

export function usePreguntasInformeSintetico(informeBaseId?: number | null) {
  const [preguntas, setPreguntas] = useState<PreguntaInformeSintetico[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // si no hay informe base, no hacemos nada
    if (!informeBaseId) return;

    const fetchPreguntas = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `${API}/preguntas_sintetico/base/${informeBaseId}`;
        console.log("🔍 [usePreguntasInformeSintetico] GET:", url);

        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener preguntas del informe sintético");

        const data = await res.json();
        console.log("📦 Preguntas recibidas:", data);
        setPreguntas(data);
      } catch (err: any) {
        console.error("Error en usePreguntasInformeSintetico:", err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchPreguntas();
  }, [informeBaseId]);

  return { preguntas, loading, error };
}
