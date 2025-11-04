export enum EstadoEncuesta {
  ABIERTA = "abierta",
  CERRADA = "cerrada",
}

export enum Cursado {
  PrimerCuatrimestre = "cuatrimestre 1",
  SegundoCuatrimestre = "cuatrimestre 2",
  Anual = "Anual"
}

export interface Encuesta {
    id: number;
    asignatura: string;
    cursado: Cursado;
    estado: EstadoEncuesta;  
    fecha_fin: string; 
}

interface Props {
  encuesta: Encuesta;
  textoBoton: string;
  colorBoton?: string;         
  iconoCard?: string;        
  textoEstado: string;        
  colorEstado?: string;       
  fechaPrefix?: string;       
  onPrimaryAction?: (encuesta: Encuesta) => void;
}

export interface RespuestaAbierta {
  id: number;
  pregunta: string;
  respuesta: string;
  asignatura: string;
  asignaturaId: number;
  fecha: string;
  sentimiento?: 'positivo' | 'neutral' | 'negativo';
  categoria?: string;
}

export interface FiltrosRespuestas {
  asignaturaId: number | null;
  sentimiento: string | null;
  busqueda: string;
}

export interface PreguntaEncuesta {
  id: number;
  texto: string;
  tipo: 'abierta' | 'opcion_multiple' | 'unica_opcion' | 'booleana';
  opciones: string[];
  categoria_id?: number;
}

export interface RespuestaEncuesta {
  pregunta_id: number;
  respuesta: string | string[] | boolean;
}

export interface FormularioEncuestaCompleto {
  id: number;
  titulo: string;
  asignatura: string;
  docente: string;
  ciclo_lectivo: string;
  categorias: CategoriaConPreguntas[];
  preguntas_abiertas: PreguntaAbiertaEstudiante[];
}

export interface CategoriaConPreguntas {
  id: number;
  nombre: string;
  codigo: string;
  preguntas: PreguntaParaEstudiante[];
}

export interface PreguntaParaEstudiante {
  id: number;
  texto: string;
  tipo: string;
  opciones: OpcionParaEstudiante[];
}

export interface OpcionParaEstudiante {
  id: number;
  texto: string;
  valor: string;
}

export interface PreguntaAbiertaEstudiante {
  id: string;
  texto: string;
  tipo: string;
  seccion: string;
}

export interface FormularioEncuesta {
  encuesta: {
    id: number;
    titulo: string;
    nombre: string;
  };
  asignatura: {
    id: number;
    nombre: string;
    codigo?: string;
  };
  docente?: {
    id: number;
    nombre: string;
    apellido: string;
  };
  preguntas: PreguntaEncuesta[];
}

export interface PreguntaEscala {
  id: number;
  texto: string;
  tipo: 'escala';
  categoria: string;
  seccion: string; 
}

export interface PreguntaAbierta {
  id: string;
  texto: string;
  tipo: 'abierta';
  seccion: string;
}

export interface FormularioCicloBasico {
  encuesta: {
    id: number;
    titulo: string;
    tipo: 'ciclo_basico';
    escala: {
      tipo: 'sino_npo';
      valores: Array<{
        valor: 'si' | 'no' | 'npo';
        etiqueta: string;
      }>;
    };
  };
  asignatura: {
    id: number;
    nombre: string;
    codigo?: string;
  };
  docente?: {
    id: number;
    nombre: string;
    apellido: string;
  };
  preguntas: PreguntaEscala[];
  preguntas_abiertas: PreguntaAbierta[];
}

// Mock data para desarrollo
export const formularioMock: FormularioEncuesta = {
  encuesta: {
    id: 1,
    titulo: "Encuesta de Satisfacción 2025",
    nombre: "Encuesta de Satisfacción"
  },
  asignatura: {
    id: 1,
    nombre: "Programación I",
    codigo: "PROG-101"
  },
  docente: {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez"
  },
  preguntas: [
    {
      id: 1,
      texto: "¿Cómo calificarías el contenido del curso?",
      tipo: 'unica_opcion',
      opciones: ["Excelente", "Bueno", "Regular", "Malo"]
    },
    {
      id: 2,
      texto: "¿Qué aspectos te gustaron más del curso?",
      tipo: 'opcion_multiple',
      opciones: ["Contenido", "Docente", "Materiales", "Evaluaciones"]
    },
    {
      id: 3,
      texto: "Comentarios adicionales:",
      tipo: 'abierta',
      opciones: []
    }
  ]
};