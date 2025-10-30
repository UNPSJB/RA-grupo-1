import { Pregunta, Encuesta, EstadisticasEncuesta, TipoPregunta, CategoriaPregunta } from '../types/encuestasTypes';

const API_BASE = 'http://127.0.0.1:8000';

// Datos mock para categorías (temporal hasta tener API de categorías)
const categoriasMock: CategoriaPregunta[] = [
  { id: 1, codigo: 'A', nombre: 'Planificación de la Enseñanza', orden: 1 },
  { id: 2, codigo: 'B', nombre: 'Desarrollo de la Enseñanza', orden: 2 },
  { id: 3, codigo: 'C', nombre: 'Evaluación del Aprendizaje', orden: 3 },
  { id: 4, codigo: 'D', nombre: 'Clima del Aula', orden: 4 },
  { id: 5, codigo: 'E', nombre: 'Recursos y Materiales', orden: 5 },
  { id: 6, codigo: 'F', nombre: 'Desarrollo Profesional', orden: 6 },
  { id: 7, codigo: 'G', nombre: 'Sugerencias y Comentarios', orden: 7 }
];

// Utilidades de mapeo
const mapearPreguntaDesdeAPI = (item: any, index: number): Pregunta => ({
  id: item.id,
  texto: item.texto,
  tipo: item.tipo as TipoPregunta,
  opciones: item.opciones || [],
  categoriaId: 1, // Categoría A por defecto (mejorable)
  orden: index + 1,
  activa: true,
  fechaCreacion: item.created_at || new Date().toISOString()
});

const mapearEncuestaDesdeAPI = (item: any): Encuesta => ({
  id: item.id,
  titulo: item.titulo,
  descripcion: `${item.carrera} - ${item.sede} - ${item.cursado} ${item.año}`,
  categorias: categoriasMock,
  preguntas: [], // Vacío por ahora (mejorable)
  activa: item.activa,
  fechaCreacion: item.created_at,
  fechaInicio: item.fecha_inicio,
  fechaFin: item.fecha_fin,
  rolDestinatario: 'alumno'
});

// Payload helpers
const crearPayloadPregunta = (pregunta: Omit<Pregunta, 'id' | 'fechaCreacion'>) => ({
  texto: pregunta.texto,
  encuesta_id: 1, // Valor por defecto (mejorable)
  tipo: pregunta.tipo,
  opciones: pregunta.tipo === 'cerrada' ? [1, 2, 3, 4] : [] // IDs de opciones por defecto
});

const crearPayloadEncuesta = (encuesta: Omit<Encuesta, 'id' | 'fechaCreacion'>) => ({
  titulo: encuesta.titulo,
  año: new Date().getFullYear(),
  cursado: "PRIMER CUATRIMESTRE", // Configurable (mejorable)
  fecha_inicio: encuesta.fechaInicio,
  fecha_fin: encuesta.fechaFin,
  carrera: "Licenciatura en Sistemas", // Configurable (mejorable)
  sede: "Trelew", // Configurable (mejorable)
  asignatura_id: 1, // Valor por defecto (mejorable)
  estado: "abierta",
  activa: encuesta.activa
});

// Handlers de fetch genéricos
const handleFetchResponse = async (response: Response, operation: string) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al ${operation}: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return response.json();
};

const fetchWithErrorHandling = async (url: string, options: RequestInit, operation: string) => {
  try {
    console.log(`🔍 ${operation}:`, { url, options: options.method });
    const response = await fetch(url, options);
    return await handleFetchResponse(response, operation);
  } catch (error) {
    console.error(`❌ Error en ${operation}:`, error);
    throw error;
  }
};

export const encuestasService = {
  // ==================== OPERACIONES CON CATEGORÍAS ====================
  obtenerCategorias: async (): Promise<CategoriaPregunta[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(categoriasMock);
      }, 500);
    });
  },

  // ==================== OPERACIONES CON PREGUNTAS ====================
  obtenerPreguntas: async (): Promise<Pregunta[]> => {
    try {
      const data = await fetchWithErrorHandling(
        `${API_BASE}/preguntas/`,
        { method: 'GET' },
        'obtener preguntas'
      );
      
      return Array.isArray(data) 
        ? data.map(mapearPreguntaDesdeAPI)
        : [mapearPreguntaDesdeAPI(data, 0)];
    } catch (error) {
      console.error('❌ Error fetching preguntas:', error);
      throw new Error(`No se pudieron cargar las preguntas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  obtenerPreguntasPorCategoria: async (categoriaId: number): Promise<Pregunta[]> => {
    try {
      const todasLasPreguntas = await encuestasService.obtenerPreguntas();
      return todasLasPreguntas.filter(p => p.categoriaId === categoriaId && p.activa);
    } catch (error) {
      console.error(`❌ Error obteniendo preguntas para categoría ${categoriaId}:`, error);
      throw error;
    }
  },

  crearPregunta: async (pregunta: Omit<Pregunta, 'id' | 'fechaCreacion'>): Promise<Pregunta> => {
    try {
      const payload = crearPayloadPregunta(pregunta);
      console.log('📤 Enviando pregunta:', payload);

      const endpoint = pregunta.tipo === 'abierta' 
        ? `${API_BASE}/preguntas/abierta`
        : `${API_BASE}/preguntas/cerrada`;

      const nuevaPregunta = await fetchWithErrorHandling(
        endpoint,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        },
        'crear pregunta'
      );

      console.log('✅ Pregunta creada:', nuevaPregunta);

      return {
        id: nuevaPregunta.id,
        texto: nuevaPregunta.texto || pregunta.texto,
        tipo: pregunta.tipo,
        opciones: pregunta.opciones || [],
        categoriaId: pregunta.categoriaId,
        orden: pregunta.orden,
        activa: true,
        fechaCreacion: nuevaPregunta.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error creating pregunta:', error);
      throw error;
    }
  },

  eliminarPregunta: async (preguntaId: number): Promise<void> => {
  try {
    console.log(`🗑️ Eliminando pregunta ${preguntaId}`);
    
    // Opción 1: Si tu API elimina por ID directo (más común)
    const response = await fetch(`${API_BASE}/preguntas/${preguntaId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al eliminar pregunta: ${response.status} ${response.statusText}`);
    }

    console.log('✅ Pregunta eliminada exitosamente');
  } catch (error) {
    console.error(`❌ Error deleting pregunta ${preguntaId}:`, error);
    throw error;
  }
},


  // ==================== OPERACIONES CON ENCUESTAS ====================
  obtenerEncuestas: async (): Promise<Encuesta[]> => {
    try {
      const data = await fetchWithErrorHandling(
        `${API_BASE}/encuestas/`,
        { method: 'GET' },
        'obtener encuestas'
      );

      const encuestasArray = Array.isArray(data) ? data : [data];
      return encuestasArray.map(mapearEncuestaDesdeAPI);
    } catch (error) {
      console.error('❌ Error fetching encuestas:', error);
      throw new Error(`No se pudieron cargar las encuestas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  crearEncuesta: async (encuesta: Omit<Encuesta, 'id' | 'fechaCreacion'>): Promise<Encuesta> => {
    try {
      const payload = crearPayloadEncuesta(encuesta);
      console.log('📤 Enviando encuesta:', payload);

      const nuevaEncuesta = await fetchWithErrorHandling(
        `${API_BASE}/encuestas/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        },
        'crear encuesta'
      );

      console.log('✅ Encuesta creada:', nuevaEncuesta);

      return {
        id: nuevaEncuesta.id,
        titulo: nuevaEncuesta.titulo,
        descripcion: encuesta.descripcion,
        categorias: encuesta.categorias,
        preguntas: encuesta.preguntas,
        activa: nuevaEncuesta.activa,
        fechaCreacion: nuevaEncuesta.created_at,
        fechaInicio: nuevaEncuesta.fecha_inicio,
        fechaFin: nuevaEncuesta.fecha_fin,
        rolDestinatario: encuesta.rolDestinatario
      };
    } catch (error) {
      console.error('❌ Error creating encuesta:', error);
      throw error;
    }
  },

  // ==================== OPERACIONES CON ESTADÍSTICAS ====================
  obtenerEstadisticasEncuesta: async (encuestaId: number): Promise<EstadisticasEncuesta> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const estadisticas: EstadisticasEncuesta = {
          encuestaId,
          totalRespuestas: 45,
          preguntas: [
            {
              preguntaId: 1,
              textoPregunta: '¿El docente planifica las clases de manera organizada?',
              tipo: 'cerrada',
              respuestas: ['Siempre', 'Frecuentemente', 'Frecuentemente', 'Ocasionalmente', 'Siempre'],
              estadisticas: {
                'Siempre': 20,
                'Frecuentemente': 15,
                'Ocasionalmente': 8,
                'Nunca': 2
              }
            },
            {
              preguntaId: 2,
              textoPregunta: '¿El docente demuestra dominio de los contenidos?',
              tipo: 'cerrada',
              respuestas: ['Excelente', 'Bueno', 'Bueno', 'Regular', 'Excelente'],
              estadisticas: {
                'Excelente': 25,
                'Bueno': 15,
                'Regular': 5,
                'Deficiente': 0
              }
            },
            {
              preguntaId: 3,
              textoPregunta: '¿Qué sugerencias tienes para mejorar el curso?',
              tipo: 'abierta',
              respuestas: [
                'Muy buen curso, todo excelente',
                'Podría mejorar la organización de los materiales',
                'Más ejercicios prácticos por favor'
              ]
            }
          ]
        };
        resolve(estadisticas);
      }, 500);
    });
  },

  // ==================== MÉTODOS ADICIONALES UTILES ====================
  obtenerEncuestaPorId: async (id: number): Promise<Encuesta | null> => {
    try {
      const encuestas = await encuestasService.obtenerEncuestas();
      return encuestas.find(encuesta => encuesta.id === id) || null;
    } catch (error) {
      console.error(`❌ Error obteniendo encuesta ${id}:`, error);
      throw error;
    }
  },

  activarDesactivarEncuesta: async (id: number, activa: boolean): Promise<void> => {
    try {
      await fetchWithErrorHandling(
        `${API_BASE}/encuestas/${id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activa })
        },
        `${activa ? 'activar' : 'desactivar'} encuesta`
      );
      console.log(`✅ Encuesta ${id} ${activa ? 'activada' : 'desactivada'} exitosamente`);
    } catch (error) {
      console.error(`❌ Error actualizando estado de encuesta ${id}:`, error);
      throw error;
    }
  }
};

export default encuestasService;