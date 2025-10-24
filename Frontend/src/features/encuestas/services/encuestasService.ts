import { Pregunta, Encuesta, EstadisticasEncuesta, TipoPregunta, CategoriaPregunta } from '../types/encuestasTypes';

const API_BASE = 'http://127.0.0.1:8000';

// Mientras no tengas categorías en la API, las mantenemos como mock
const categoriasMock: CategoriaPregunta[] = [
  { id: 1, codigo: 'A', nombre: 'Planificación de la Enseñanza', orden: 1 },
  { id: 2, codigo: 'B', nombre: 'Desarrollo de la Enseñanza', orden: 2 },
  { id: 3, codigo: 'C', nombre: 'Evaluación del Aprendizaje', orden: 3 },
  { id: 4, codigo: 'D', nombre: 'Clima del Aula', orden: 4 },
  { id: 5, codigo: 'E', nombre: 'Recursos y Materiales', orden: 5 },
  { id: 6, codigo: 'F', nombre: 'Desarrollo Profesional', orden: 6 },
  { id: 7, codigo: 'G', nombre: 'Sugerencias y Comentarios', orden: 7 }
];

export const encuestasService = {
  // Categorías (mock por ahora)
  obtenerCategorias: async (): Promise<CategoriaPregunta[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(categoriasMock);
      }, 500);
    });
  },

  // Preguntas - CONECTADO A TU API
  obtenerPreguntas: async (): Promise<Pregunta[]> => {
    try {
      const response = await fetch(`${API_BASE}/preguntas/`);
      if (!response.ok) {
        throw new Error('Error al obtener preguntas');
      }
      const data = await response.json();
      
      // Mapear la respuesta de tu API a nuestro tipo Pregunta
      return data.map((item: any, index: number) => ({
        id: item.id,
        texto: item.texto,
        tipo: item.tipo as TipoPregunta,
        opciones: item.opciones || [],
        categoriaId: 1, // Asignamos a categoría A por defecto (podemos mejorarlo luego)
        orden: index + 1,
        activa: true,
        fechaCreacion: item.created_at || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching preguntas:', error);
      throw error;
    }
  },

  crearPregunta: async (pregunta: Omit<Pregunta, 'id' | 'fechaCreacion'>): Promise<Pregunta> => {
    try {
      // Para tu API, necesitamos enviar encuesta_id y opciones como array de números
      // Como no tenemos encuesta específica, usamos 1 como valor por defecto
      const payload = {
        texto: pregunta.texto,
        encuesta_id: 1, // Valor por defecto - podemos hacerlo configurable luego
        tipo: pregunta.tipo,
        opciones: pregunta.tipo === 'cerrada' ? [1, 2, 3, 4] : [] // IDs de opciones por defecto
      };

      console.log('Enviando pregunta:', payload);

      const response = await fetch(`${API_BASE}/preguntas/cerrada`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear pregunta: ${errorText}`);
      }

      const nuevaPregunta = await response.json();
      
      return {
        id: nuevaPregunta.id,
        texto: nuevaPregunta.texto,
        tipo: pregunta.tipo,
        opciones: pregunta.opciones || [],
        categoriaId: pregunta.categoriaId,
        orden: pregunta.orden,
        activa: true,
        fechaCreacion: nuevaPregunta.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating pregunta:', error);
      throw error;
    }
  },

  eliminarPregunta: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/preguntas/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar pregunta');
      }
    } catch (error) {
      console.error('Error deleting pregunta:', error);
      throw error;
    }
  },

  // Encuestas - CONECTADO A TU API
  obtenerEncuestas: async (): Promise<Encuesta[]> => {
    try {
      const response = await fetch(`${API_BASE}/encuestas/`);
      if (!response.ok) {
        throw new Error('Error al obtener encuestas');
      }
      const data = await response.json();
      
      // Tu API devuelve un objeto, no un array - lo convertimos a array
      const encuestasArray = Array.isArray(data) ? data : [data];
      
      return encuestasArray.map((item: any) => ({
        id: item.id,
        titulo: item.titulo,
        descripcion: `${item.carrera} - ${item.sede} - ${item.cursado} ${item.año}`,
        categorias: categoriasMock,
        preguntas: [], // Por ahora vacío - luego podemos cargar las preguntas de cada encuesta
        activa: item.activa,
        fechaCreacion: item.created_at,
        fechaInicio: item.fecha_inicio,
        fechaFin: item.fecha_fin,
        rolDestinatario: 'alumno'
      }));
    } catch (error) {
      console.error('Error fetching encuestas:', error);
      throw error;
    }
  },

  crearEncuesta: async (encuesta: Omit<Encuesta, 'id' | 'fechaCreacion'>): Promise<Encuesta> => {
    try {
      const payload = {
        titulo: encuesta.titulo,
        año: new Date().getFullYear(),
        cursado: "PRIMER CUATRIMESTRE", // Podemos hacer esto configurable
        fecha_inicio: encuesta.fechaInicio,
        fecha_fin: encuesta.fechaFin,
        carrera: "Licenciatura en Sistemas", // Podemos hacer esto configurable
        sede: "Trelew", // Podemos hacer esto configurable
        asignatura_id: 1, // Valor por defecto - importante: necesitamos saber cómo obtener esto
        estado: "abierta",
        activa: encuesta.activa
      };

      console.log('Enviando encuesta:', payload);

      const response = await fetch(`${API_BASE}/encuestas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear encuesta: ${errorText}`);
      }

      const nuevaEncuesta = await response.json();
      
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
      console.error('Error creating encuesta:', error);
      throw error;
    }
  },

  // Estadísticas (mock por ahora - no tienes endpoint)
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
            }
          ]
        };
        resolve(estadisticas);
      }, 500);
    });
  }
};