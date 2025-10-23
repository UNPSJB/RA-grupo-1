export type TipoPregunta = 'abierta' | 'cerrada';

export interface CategoriaPregunta {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  orden: number;
}

export interface Pregunta {
  id: number;
  texto: string;
  tipo: TipoPregunta;
  opciones?: string[];
  categoriaId: number; 
  orden: number;
  activa: boolean;
  fechaCreacion: string;
}

export interface Encuesta {
  id: number;
  titulo: string;
  descripcion: string;
  categorias: CategoriaPregunta[];
  preguntas: Pregunta[];
  activa: boolean;
  fechaCreacion: string;
  fechaInicio: string;
  fechaFin: string;
  rolDestinatario?: string;
}

export interface RespuestaEncuesta {
  id: number;
  encuestaId: number;
  alumnoId: number;
  respuestas: RespuestaPregunta[];
  fechaCompletada: string;
}

export interface RespuestaPregunta {
  preguntaId: number;
  respuesta: string;
}

export interface EstadisticasEncuesta {
  encuestaId: number;
  totalRespuestas: number;
  preguntas: EstadisticaPregunta[];
}

export interface EstadisticaPregunta {
  preguntaId: number;
  textoPregunta: string;
  tipo: TipoPregunta;
  respuestas: string[];
  estadisticas?: {
    [opcion: string]: number;
  };
}