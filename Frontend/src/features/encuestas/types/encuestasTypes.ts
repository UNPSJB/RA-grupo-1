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