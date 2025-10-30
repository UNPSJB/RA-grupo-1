import { Pregunta, Encuesta, EstadisticasEncuesta, TipoPregunta, CategoriaPregunta } from '../types/encuestasTypes';

const API_BASE = 'http://127.0.0.1:8000';

// Datos mock
const categoriasMock: CategoriaPregunta[] = [
  { id: 1, codigo: 'A', nombre: 'Planificación de la Enseñanza', orden: 1 },
  { id: 2, codigo: 'B', nombre: 'Desarrollo de la Enseñanza', orden: 2 },
  { id: 3, codigo: 'C', nombre: 'Evaluación del Aprendizaje', orden: 3 },
  { id: 4, codigo: 'D', nombre: 'Clima del Aula', orden: 4 },
  { id: 5, codigo: 'E', nombre: 'Recursos y Materiales', orden: 5 },
  { id: 6, codigo: 'F', nombre: 'Desarrollo Profesional', orden: 6 },
  { id: 7, codigo: 'G', nombre: 'Sugerencias y Comentarios', orden: 7 }
];

const preguntasMock: Pregunta[] = [
  {
    id: 1,
    texto: '¿El docente planifica las clases de manera organizada?',
    tipo: 'cerrada',
    opciones: ['Siempre', 'Frecuentemente', 'Ocasionalmente', 'Nunca'],
    categoriaId: 1,
    orden: 1,
    activa: true,
    fechaCreacion: '2025-01-15'
  },
  {
    id: 2,
    texto: '¿El docente demuestra dominio de los contenidos?',
    tipo: 'cerrada',
    opciones: ['Excelente', 'Bueno', 'Regular', 'Deficiente'],
    categoriaId: 2,
    orden: 1,
    activa: true,
    fechaCreacion: '2025-01-15'
  },
  {
    id: 3,
    texto: '¿Qué sugerencias tienes para mejorar el curso?',
    tipo: 'abierta',
    categoriaId: 7,
    orden: 1,
    activa: true,
    fechaCreacion: '2025-01-15'
  },
  {
    id: 4,
    texto: '¿Los criterios de evaluación son claros?',
    tipo: 'cerrada',
    opciones: ['Muy claros', 'Claros', 'Poco claros', 'Nada claros'],
    categoriaId: 3,
    orden: 1,
    activa: true,
    fechaCreacion: '2025-01-15'
  }
];

const encuestasMock: Encuesta[] = [
  {
    id: 1,
    titulo: 'Encuesta de Satisfacción Docente - Primer Semestre 2025',
    descripcion: 'Encuesta para evaluar la calidad docente del primer semestre',
    categorias: categoriasMock,
    preguntas: preguntasMock,
    activa: true,
    fechaCreacion: '2025-01-15',
    fechaInicio: '2025-03-01',
    fechaFin: '2025-03-31',
    rolDestinatario: 'alumno'
  }
];

// Servicio principal
export const encuestasService = {
  // Operaciones con Categorías
  obtenerCategorias: async (): Promise<CategoriaPregunta[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(categoriasMock);
      }, 500);
    });
  },

  // Operaciones con Preguntas
  obtenerPreguntas: async (): Promise<Pregunta[]> => {
    try {
      console.log('🔍 Obteniendo preguntas desde:', `${API_BASE}/preguntas/`);
      const response = await fetch(`${API_BASE}/preguntas/`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📥 Preguntas recibidas:', data);
      
      return data.map((item: any, index: number) => ({
        id: item.id,
        texto: item.texto,
        tipo: item.tipo as TipoPregunta,
        opciones: item.opciones || [],
        categoriaId: 1, // Por defecto, ajustar según API real
        orden: index + 1,
        activa: true,
        fechaCreacion: item.created_at || new Date().toISOString()
      }));
    } catch (error) {
      console.error('❌ Error fetching preguntas:', error);
      throw new Error(`No se pudieron cargar las preguntas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  obtenerPreguntasPorCategoria: async (categoriaId: number): Promise<Pregunta[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(preguntasMock.filter(p => p.categoriaId === categoriaId && p.activa));
      }, 500);
    });
  },

  crearPregunta: async (preguntaData: {
    texto: string;
    tipo: TipoPregunta;
    opciones?: string[];
    categoriaId: number;
    orden: number;
    activa: boolean;
  }): Promise<Pregunta> => {
    try {
      // Determinar endpoint según tipo
      const endpoint = preguntaData.tipo === 'abierta' 
        ? `${API_BASE}/preguntas/abierta`
        : `${API_BASE}/preguntas/cerrada`;

      // Preparar payload según API
      const payload = {
        texto: preguntaData.texto,
        encuesta_id: 1, // IMPORTANTE: Definir encuesta destino
        tipo: preguntaData.tipo,
        opciones: preguntaData.tipo === 'cerrada' ? preguntaData.opciones || [] : []
      };

      console.log('📤 Enviando pregunta:', { endpoint, payload });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear pregunta: ${response.status} ${response.statusText}`);
      }

      const nuevaPregunta = await response.json();
      console.log('✅ Pregunta creada:', nuevaPregunta);
      
      return {
        id: nuevaPregunta.id,
        texto: nuevaPregunta.texto || preguntaData.texto,
        tipo: preguntaData.tipo,
        opciones: preguntaData.opciones || [],
        categoriaId: preguntaData.categoriaId,
        orden: preguntaData.orden,
        activa: preguntaData.activa,
        fechaCreacion: nuevaPregunta.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error creating pregunta:', error);
      throw error;
    }
  },

  eliminarPregunta: async (encuestaId: number, preguntaId: number): Promise<void> => {
    try {
      console.log(`🗑️ Eliminando pregunta ${preguntaId} de encuesta ${encuestaId}`);
      
      // Usar endpoint específico para relación formulario-pregunta
      const response = await fetch(`${API_BASE}/formulario/${encuestaId}/pregunta/${preguntaId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar pregunta: ${response.status} ${response.statusText}`);
      }

      console.log('✅ Pregunta eliminada de la encuesta exitosamente');
    } catch (error) {
      console.error(`❌ Error deleting pregunta ${preguntaId}:`, error);
      throw error;
    }
  },

  // Operaciones con Encuestas
  obtenerEncuestas: async (): Promise<Encuesta[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(encuestasMock);
      }, 500);
    });
  },

  crearEncuesta: async (encuesta: Omit<Encuesta, 'id' | 'fechaCreacion'>): Promise<Encuesta> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const nuevaEncuesta: Encuesta = {
          ...encuesta,
          id: Date.now(),
          fechaCreacion: new Date().toISOString().split('T')[0]
        };
        encuestasMock.push(nuevaEncuesta);
        resolve(nuevaEncuesta);
      }, 500);
    });
  },

  // Operaciones con Estadísticas
  obtenerEstadisticasEncuesta: async (encuestaId: number): Promise<EstadisticasEncuesta> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const encuesta = encuestasMock.find(e => e.id === encuestaId);
        const estadisticas: EstadisticasEncuesta = {
          encuestaId,
          totalRespuestas: 45,
          preguntas: encuesta?.preguntas.map(pregunta => ({
            preguntaId: pregunta.id,
            textoPregunta: pregunta.texto,
            tipo: pregunta.tipo,
            respuestas: pregunta.tipo === 'cerrada' 
              ? ['Siempre', 'Frecuentemente', 'Frecuentemente', 'Ocasionalmente', 'Siempre']
              : ['Muy buen curso', 'Podría mejorar', 'Excelente material'],
            estadisticas: pregunta.tipo === 'cerrada' ? {
              'Siempre': 20,
              'Frecuentemente': 15,
              'Ocasionalmente': 8,
              'Nunca': 2
            } : undefined
          })) || []
        };
        resolve(estadisticas);
      }, 500);
    });
  }
};

export default encuestasService;