import { useState, useEffect } from 'react';
import { Asignatura } from '../types/asignaturaTypes';
import { asignaturaService } from '../services/asignaturaServices';

export function useAsignaturas(docenteId?: number) {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await asignaturaService.obtenerAsignaturas(docenteId);
        setAsignaturas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar asignaturas');
      } finally {
        setLoading(false);
      }
    };

    fetchAsignaturas();
  }, [docenteId]);

  return { asignaturas, loading, error };
}