import { useState, useEffect } from 'react';
import { DetalleAsignatura } from '../types/asignaturaTypes';
import { asignaturaService } from '../services/asignaturaServices';

export function useDetalleAsignatura(asignaturaId: string) {
  const [detalle, setDetalle] = useState<DetalleAsignatura | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await asignaturaService.obtenerDetalleAsignatura(asignaturaId);
        setDetalle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el detalle');
      } finally {
        setLoading(false);
      }
    };

    if (asignaturaId) {
      fetchDetalle();
    }
  }, [asignaturaId]);

  return { detalle, loading, error };
}