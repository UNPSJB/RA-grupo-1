import { useState, useEffect } from "react";

export function useEncuestasIncompletas(alumnoId: number){
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `http://localhost:8000/alumnos/${alumnoId}/encuestas/incompletas`;

  const fetchEncuestas = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al conseguir las encuestas");
      const data = await response.json();
      setEncuestas(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEncuestas(); }, []);

  return { encuestas, loading, error, refetch: fetchEncuestas };
}
