import { useState, useEffect, useRef } from 'react';
import { FormularioEncuestaCompleto } from '../types/encuestaTypes';
import { encuestaService } from '../services/encuestasService';

interface UseFormularioEncuestaReturn {
  formulario: FormularioEncuestaCompleto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFormularioEncuesta = (encuestaId: number): UseFormularioEncuestaReturn => {
  const [formulario, setFormulario] = useState<FormularioEncuesta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Usar ref para evitar llamadas duplicadas
  const hasFetched = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchFormulario = async (signal?: AbortSignal) => {
    // Si ya se hizo fetch y tenemos datos, no volver a llamar
    if (hasFetched.current && formulario) {
      console.log('✅ Formulario ya cargado, usando cache...');
      return;
    }

  
    if (!encuestaId || encuestaId === 0) {
      setError('ID de encuesta inválido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando formulario para encuesta', encuestaId, '...');
      
      const data = await encuestaService.obtenerFormularioEncuesta(encuestaId, signal);
      
  
      if (signal?.aborted) {
        console.log('🚫 Petición cancelada');
        return;
      }
      
      console.log('✅ Formulario cargado exitosamente:', data);
      setFormulario(data);
      hasFetched.current = true;
      
    } catch (err: any) {

      if (err.name === 'AbortError' || err.name === 'CanceledError') {
        console.log('🚫 Petición abortada');
        return;
      }
      
      console.error('❌ Error al cargar formulario:', err);
      const mensaje = err.response?.data?.message || err.message || 'Error al cargar el formulario';
      setError(mensaje);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  const refetch = () => {
    console.log('🔄 Recargando formulario...');
    hasFetched.current = false;
    setFormulario(null);
    fetchFormulario();
  };

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    if (!hasFetched.current || !formulario) {
      fetchFormulario(signal);
    }

    return () => {
      if (abortControllerRef.current) {
        console.log('🧹 Limpiando petición...');
        abortControllerRef.current.abort();
      }
    };
  }, [encuestaId]); 

  return {
    formulario,
    loading,
    error,
    refetch
  };
};