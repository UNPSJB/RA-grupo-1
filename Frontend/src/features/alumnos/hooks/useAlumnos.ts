import { useEffect, useState } from "react";

const API = "http://localhost:8000";

export interface Encuesta {
  id: number;
  titulo: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  activa: boolean;
}

export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  carrera_id: number;
}

export function useAlumno(alumnoId: number) {
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        setLoading(true);

        // 1) GET alumno
        const resAlumno = await fetch(`${API}/alumnos/${alumnoId}`);
        if (!resAlumno.ok) throw new Error("No se pudo cargar el alumno");
        const dataAlumno = await resAlumno.json();
        setAlumno(dataAlumno);

        // 2) GET encuestas del alumno
        const resEncuestas = await fetch(`${API}/encuestas/alumno/${alumnoId}/disponibles`);
        if (!resEncuestas.ok) throw new Error("No se pudieron cargar las encuestas");
        const dataEncuestas = await resEncuestas.json();
        setEncuestas(dataEncuestas);

        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, [alumnoId]);

  return { alumno, encuestas, loading, error };
}
