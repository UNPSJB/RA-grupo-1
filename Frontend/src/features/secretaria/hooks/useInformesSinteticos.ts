import { useEffect, useState } from "react";
import {
  getInformesSinteticosSecretaria,
  InformeSinteticoResumen,
} from "../services/informesSinteticosService";

export function useInformesSinteticos() {
  const [informes, setInformes] = useState<InformeSinteticoResumen[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    const fetchData = async () => {
      setCargando(true);
      setError(null);
      try {
        const data = await getInformesSinteticosSecretaria();
        if (!cancelado) {
          setInformes(data);
        }
      } catch (err) {
        console.error("Error cargando informes sintéticos:", err);
        if (!cancelado) {
          setError("No se pudieron cargar los informes sintéticos.");
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelado = true;
    };
  }, []);

  return { informes, cargando, error };
}
