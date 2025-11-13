import { useState, useEffect, useCallback } from "react";

export enum EstadoEncuesta {
  ABIERTA = "abierta",
  CERRADA = "cerrada",
}

export enum Cursado {
    PrimerCuatrimestre = "PRIMER CUATRIMESTRE",
    SegundoCuatrimestre = "SEGUNDO CUATRIMESTRE",
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

      const response = await fetch(
        `http://127.0.0.1:8000/encuestas/alumno/${alumnoId}/disponibles`
      );

      if (!response.ok) {
        console.warn("⚠️ Backend no disponible, usando datos de ejemplo");
        const datosEjemplo: Encuesta[] = [
          {
            id: 1,
            nombre: "Encuesta Ciclo Básico 2025",
            asignatura: "Álgebra",
            docente: "Dr. Juan Pérez",
            ciclo_lectivo: "2025-PRIMER CUATRIMESTRE",
            año: 2025,
            cursado: "PRIMER CUATRIMESTRE",
            fecha_inicio: "2025-01-01T00:00:00Z",
            fecha_fin: "2025-12-31T23:59:59Z",
            carrera: "APU",
            sede: "Trelew",
            titulo: "Álgebra",
            asignatura_id: 1,
            estado: EstadoEncuesta.ABIERTA,
            activa: true,
          },
          {
            id: 2,
            nombre: "Encuesta Ciclo Básico 2025",
            asignatura: "Desarrollo de Software",
            docente: "Ing. María González",
            ciclo_lectivo: "2025-PRIMER CUATRIMESTRE",
            año: 2025,
            cursado: "PRIMER CUATRIMESTRE",
            fecha_inicio: "2025-01-01T00:00:00Z",
            fecha_fin: "2025-12-31T23:59:59Z",
            carrera: "APU",
            sede: "Trelew",
            titulo: "Desarrollo de Software",
            asignatura_id: 2,
            estado: EstadoEncuesta.ABIERTA,
            activa: true,
          },
        ];

        setEncuestas(datosEjemplo);
        return;
      }

      const data = await response.json();
      console.log("📥 Encuestas recibidas del backend:", data);

      setEncuestas(data);
    } catch (err: any) {
      console.error("❌ Error cargando encuestas:", err);
      setError("Error al cargar encuestas. Mostrando datos locales.");
    } finally {
      setLoading(false);
    }
  }, [alumnoId]);

  useEffect(() => {
    fetchEncuestas();
  }, [fetchEncuestas]);

  return { encuestas, loading, error, refetch: fetchEncuestas };
};