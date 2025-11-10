import { useState, useEffect } from "react";

export enum EstadoInforme {
  ABIERTO = "abierto",
  CERRADO = "cerrado",
}

export interface Informe {
  id: number;
  titulo?: string;
  contenido?: string;
  fecha?: string;
  carrera_id?: number;
  estado?: EstadoInforme;
}

export function useInformes(carreraId?: number | null) {
  const [informes, setInformes] = useState<Informe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:8000/informes";

  const fetchInformes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Si no hay carrera, no buscamos nada
      if (!carreraId) {
        setInformes([]);
        return;
      }

      const url = `${API_URL}?carrera_id=${carreraId}`;
      console.log("🔍 Llamando a:", url);

      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al conseguir los informes");

      const data = await response.json();
      console.log("📦 Datos recibidos:", data);

      setInformes(data);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Cada vez que cambia la carrera, se vuelve a ejecutar
  useEffect(() => {
    fetchInformes();
  }, [carreraId]);

  return { informes, loading, error, refetch: fetchInformes };
}