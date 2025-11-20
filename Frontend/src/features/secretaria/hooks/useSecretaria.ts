import { useState, useEffect } from 'react';
import { Pregunta, Encuesta, EstadisticasEncuesta, TipoPregunta, CategoriaPregunta } from '../types/encuestasTypes';
import { encuestasService } from '../services/encuestasService';
import * as secretariaService from '../../encuestas/services/encuestasService'; 

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

  const crearPregunta = async (
    texto: string, 
    tipo: TipoPregunta, 
    opciones?: string[], 
    categoriaId?: number,
    encuestaId?: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Crear la pregunta primero
      const preguntaData = {
        texto,
        tipo,
        encuesta_id: encuestaId || 1, // Usar encuesta por defecto o pasarla como parámetro
        categoria_id: categoriaId || null
      };

      console.log('📤 Creando pregunta:', preguntaData);
      
      const preguntaCreada = await secretariaService.crearPregunta(preguntaData);
      
      console.log('✅ Pregunta creada:', preguntaCreada);

      // 2. Si es pregunta cerrada y tiene opciones, crearlas
      if (tipo === 'cerrada' && opciones && opciones.length > 0) {
        console.log('📝 Creando opciones para pregunta:', preguntaCreada.id);
        
        for (const opcionTexto of opciones) {
          try {
            const opcionCreada = await fetch('http://127.0.0.1:8000/opciones/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                texto: opcionTexto,
                contenido: opcionTexto,
                pregunta_id: preguntaCreada.id
              })
            });

            if (!opcionCreada.ok) {
              console.error(`❌ Error creando opción "${opcionTexto}"`);
            } else {
              console.log(`✅ Opción creada: "${opcionTexto}"`);
            }
          } catch (err) {
            console.error(`❌ Error creando opción "${opcionTexto}":`, err);
          }
        }
      }

      // 3. Recargar preguntas para obtener la versión actualizada
      await cargarDatosIniciales();
      
      setSuccess(`Pregunta ${tipo === 'abierta' ? 'abierta' : 'cerrada'} creada exitosamente`);
      
      return preguntaCreada;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la pregunta';
      setError(errorMessage);
      console.error('❌ Error creando pregunta:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editarPregunta = async (
    preguntaId: number,
    texto: string,
    opciones?: string[]
  ) => {
    try {
      setLoading(true);
      setError(null);

      console.log('📝 Editando pregunta:', preguntaId);

      // 1. Actualizar el texto de la pregunta
      const response = await fetch(`http://127.0.0.1:8000/preguntas/${preguntaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto: texto
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la pregunta');
      }

      const preguntaActualizada = await response.json();
      console.log('✅ Pregunta actualizada:', preguntaActualizada);

      // 2. Si tiene opciones, actualizarlas
      if (opciones && opciones.length > 0) {
        console.log('📝 Actualizando opciones...');

        // Primero, obtener las opciones existentes
        const preguntaActual = preguntas.find(p => p.id === preguntaId);
        
        if (preguntaActual && preguntaActual.opciones) {
          // Eliminar opciones antiguas
          for (const opcion of preguntaActual.opciones) {
            try {
              await fetch(`http://127.0.0.1:8000/opciones/${opcion.id}`, {
                method: 'DELETE'
              });
              console.log(`🗑️ Opción eliminada: "${opcion.texto}"`);
            } catch (err) {
              console.error('Error eliminando opción:', err);
            }
          }
        }

        // Crear nuevas opciones
        for (const opcionTexto of opciones) {
          try {
            const opcionCreada = await fetch('http://127.0.0.1:8000/opciones/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                texto: opcionTexto,
                contenido: opcionTexto,
                pregunta_id: preguntaId
              })
            });

            if (!opcionCreada.ok) {
              console.error(`❌ Error creando opción "${opcionTexto}"`);
            } else {
              console.log(`✅ Opción creada: "${opcionTexto}"`);
            }
          } catch (err) {
            console.error(`❌ Error creando opción "${opcionTexto}":`, err);
          }
        }
      }

      // 3. Recargar preguntas para obtener la versión actualizada
      await cargarDatosIniciales();
      
      setSuccess('Pregunta actualizada exitosamente');
      
      return preguntaActualizada;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al editar la pregunta';
      setError(errorMessage);
      console.error('❌ Error editando pregunta:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const eliminarPregunta = async (preguntaId: number) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🗑️ Eliminando pregunta:', preguntaId);

      // Eliminar la pregunta
      const response = await fetch(`http://127.0.0.1:8000/preguntas/${preguntaId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la pregunta');
      }

      console.log('✅ Pregunta eliminada');

      // Actualizar el estado local
      setPreguntas(prev => prev.filter(p => p.id !== preguntaId));
      setSuccess('Pregunta eliminada exitosamente');
    
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la pregunta';
      setError(errorMessage);
      console.error('❌ Error eliminando pregunta:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const crearEncuesta = async (
    titulo: string,
    descripcion: string,
    rolDestinatario: string,
    preguntasIds: number[]
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Adaptar al formato que espera tu API
      const encuestaData = {
        titulo,
        descripcion,
        activa: true,
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: '', // Ajustar según necesites
        rolDestinatario,
        categorias: [], // Ajustar según tu modelo
        preguntas: preguntas.filter(p => preguntasIds.includes(p.id))
      };

      const nuevaEncuesta = await encuestasService.crearEncuesta(encuestaData);
      setEncuestas(prev => [...prev, nuevaEncuesta]);
      setSuccess('Encuesta creada exitosamente');
      
      return nuevaEncuesta;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la encuesta';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
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
    success,
    crearPregunta,
    editarPregunta,     
    eliminarPregunta,
    crearEncuesta,
    cargarEstadisticas,
    recargarDatos: cargarDatosIniciales
  };
};