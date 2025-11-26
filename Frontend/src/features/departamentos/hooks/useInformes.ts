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

  const API_BASE = "http://localhost:8000/informes_sinteticos";
  const API_FINALIZADOS =
    "http://localhost:8000/informes_sinteticos_finalizados/finalizados/completado";

  const fetchInformes = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!carreraId) {
        setInformes([]);
        return;
      }

      // 1) Traer INFORMES BASE
      const url = `${API_BASE}?carrera_id=${carreraId}`;
      console.log("🔍 Llamando a:", url);

      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al conseguir los informes");

      const informesBase = await response.json();
      console.log("📦 Informes base recibidos:", informesBase);

      // 2) Filtrar informes YA completados
      const informesNoCompletados: Informe[] = [];

      for (const inf of informesBase) {
        const urlCheck = `${API_FINALIZADOS}?carrera_id=${carreraId}&informe_base_id=${inf.id}`;

        const checkRes = await fetch(urlCheck);
        const checkData = await checkRes.json();

        // checkData = { completado: true/false }
        if (!checkData.completado) {
          informesNoCompletados.push(inf);
        }
      }

      console.log("📄 Informes pendientes:", informesNoCompletados);

      setInformes(informesNoCompletados);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInformes();
  }, [carreraId]);

  return { informes, loading, error, refetch: fetchInformes };
}
