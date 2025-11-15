import { useEffect, useState } from "react";
import axios from "axios";

export const useCarreras = () => {
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const response = await axios.get("http://localhost:8000/carreras/");
        setCarreras(response.data);
      } catch (err: any) {
        setError("Error al cargar las carreras");
      } finally {
        setLoading(false);
      }
    };

    fetchCarreras();
  }, []);

  const seleccionarCarrera = (carrera: any) => {
    localStorage.setItem("carreraSeleccionada", JSON.stringify(carrera));
  };

  return { carreras, loading, error, seleccionarCarrera };
};
