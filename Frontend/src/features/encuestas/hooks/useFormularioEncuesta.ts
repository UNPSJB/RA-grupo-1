import { useState, useEffect } from 'react';
import { FormularioEncuestaCompleto } from '../types/encuestaTypes';
import { encuestaService } from '../services/encuestasService';

export const useFormularioEncuesta = (encuestaId: number) => {
  const [formulario, setFormulario] = useState<FormularioEncuestaCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormulario = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!encuestaId) {
          throw new Error('ID de encuesta no proporcionado');
        }

        console.log(`🔄 Cargando formulario para encuesta ${encuestaId}...`);
        const data = await encuestaService.obtenerFormularioEncuesta(encuestaId);
        console.log('✅ Formulario cargado:', data);
        
        setFormulario(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar el formulario';
        console.error('❌ Error en useFormularioEncuesta:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFormulario();
  }, [encuestaId]);

  return { formulario, loading, error };
};