import { useState, useEffect } from "react";


interface DistribucionResponse {
  labels: number[];
  data: number[];
}

const NAME_MAP: Record<number, string> = { 1: "Sí", 2: "No", 3: "NPO" };

export function useDistribucion(materiaId: number, preguntaId: number) {
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `http://localhost:8000/materias/${materiaId}/pregunta/${preguntaId}/distribucion`;

  const fetchDistribucion = async () => {
    try {
      setLoading(true);
      const resp = await fetch(API_URL);
      if (!resp.ok) throw new Error("Error al obtener distribución de respuestas");

      const json: DistribucionResponse = await resp.json();
      const mappedLabels = (json.labels ?? []).map((n) => NAME_MAP[n] ?? String(n));

      setLabels(mappedLabels);
      setData(json.data ?? []);
      setError(null);
    } catch (err: any) {
      setError(err.message ?? "Error desconocido");
      setLabels([]);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistribucion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materiaId, preguntaId]);

  return { labels, data, loading, error, refetch: fetchDistribucion };
}
