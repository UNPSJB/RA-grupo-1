import { useState, useEffect, useCallback } from "react";

export enum EstadoEncuesta {
  ABIERTA = "abierta",
  CERRADA = "cerrada",
}

export enum Cursado {
    PrimerCuatrimestre = "primer cuatrimestre",
    SegundoCuatrimestre = "segundo cuatrimestre",
    Anual = "ANUAL",
    AnioActual = 2025
}

export interface Encuesta {
    id: number;
    nombre: string;
    asignatura: string;
    docente: string;
    ciclo_lectivo: string;
    año?: number;
    cursado?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    carrera?: string;
    sede?: string;
    titulo?: string;
    asignatura_id?: number;
    estado?: EstadoEncuesta;
    activa?: boolean;
}

export const useEncuestas = (alumnoIdParam?: number) => {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const alumnoId = alumnoIdParam ?? Number(localStorage.getItem("alumno_id") || "1");

  const fetchEncuestas = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    // Validar que alumnoId sea un número válido
    if (!alumnoId || isNaN(alumnoId)) {
      throw new Error("ID de alumno inválido");
    }

    console.log(`🔍 Fetching encuestas para alumno ${alumnoId}...`);

    const response = await fetch(
      `http://127.0.0.1:8000/encuestas/alumno/${alumnoId}/disponibles`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Error del servidor:", errorData);
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error("❌ La respuesta no es un array:", data);
      throw new Error("Formato de respuesta inválido");
    }

    console.log(`✅ ${data.length} encuestas cargadas`);
    setEncuestas(data);
    
  } catch (err: any) {
    console.error("❌ Error cargando encuestas:", err);
    setError(err.message || "Error al cargar encuestas");
    setEncuestas([]); 
  } finally {
    setLoading(false);
  }
}, [alumnoId]);

  useEffect(() => {
    fetchEncuestas();
  }, [fetchEncuestas]);

  return { encuestas, loading, error, refetch: fetchEncuestas };
};