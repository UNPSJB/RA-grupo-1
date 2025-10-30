import { useState, useEffect } from 'react';
import { Pregunta, Encuesta, EstadisticasEncuesta, TipoPregunta, CategoriaPregunta } from '../types/encuestasTypes';
import { encuestasService } from '../services/encuestasService';

export const useSecretaria = () => {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [categorias, setCategorias] = useState<CategoriaPregunta[]>([]);
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasEncuesta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      const [preguntasData, encuestasData, categoriasData] = await Promise.all([
        encuestasService.obtenerPreguntas(),
        encuestasService.obtenerEncuestas(),
        encuestasService.obtenerCategorias()
      ]);
      
      setPreguntas(preguntasData);
      setEncuestas(encuestasData);
      setCategorias(categoriasData);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const crearPregunta = async (texto: string, tipo: TipoPregunta, opciones?: string[], categoriaId?: number) => {
    try {
      const nuevaPregunta = await encuestasService.crearPregunta({
        texto,
        tipo,
        opciones: tipo === 'cerrada' ? opciones : undefined,
        categoriaId: categoriaId || 1, 
        orden: preguntas.filter(p => p.categoriaId === categoriaId).length + 1,
        activa: true
      });
      setPreguntas(prev => [...prev, nuevaPregunta]);
      return nuevaPregunta;
    } catch (err) {
      setError('Error al crear la pregunta');
      throw err;
    }
  };

  // En useSecretaria.ts - CORREGIR la función eliminarPregunta
const eliminarPregunta = async (preguntaId: number) => {
  try {
    setLoading(true);
    setError(null);
    
    await encuestasService.eliminarPregunta(preguntaId);
    
    // Actualizar el estado local eliminando la pregunta
    setPreguntas(prev => prev.filter(p => p.id !== preguntaId));
    
    return true;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la pregunta';
    setError(errorMessage);
    console.error('Error eliminando pregunta:', err);
    throw err;
  } finally {
    setLoading(false);
  }
};

  const crearEncuesta = async (encuestaData: Omit<Encuesta, 'id' | 'fechaCreacion'>) => {
    try {
      const nuevaEncuesta = await encuestasService.crearEncuesta(encuestaData);
      setEncuestas(prev => [...prev, nuevaEncuesta]);
      setSuccess('Encuesta creada exitosamente');
      return nuevaEncuesta;
    } catch (err) {
      setError('Error al crear la encuesta');
      throw err;
    }
  };

  const cargarEstadisticas = async (encuestaId: number) => {
    try {
      setLoading(true);
      const stats = await encuestasService.obtenerEstadisticasEncuesta(encuestaId);
      setEstadisticas(stats);
    } catch (err) {
      setError('Error al cargar las estadísticas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    preguntas,
    categorias,
    encuestas,
    estadisticas,
    loading,
    error,
    crearPregunta,
    eliminarPregunta,
    crearEncuesta,
    cargarEstadisticas,
    recargarDatos: cargarDatosIniciales
  };
};