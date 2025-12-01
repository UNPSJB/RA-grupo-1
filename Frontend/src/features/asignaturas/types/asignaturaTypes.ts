export interface Asignatura {
  id: number;
  nombre: string;
  matricula: string;
}

export interface DetalleAsignatura extends Asignatura {
  descripcion?: string;
  profesor?: string;
  horario?: string;
  aula?: string;
  creditos?: number;
  estudiantesInscritos?: number;
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  requisitos?: string[];
  objetivos?: string[];
}

export interface AsignaturaEstado {
  asignaturaId: number;
  progreso: number;
  calificacion?: number;
  asistencia: number;
  tareasFinalizadas: number;
  tareasPendientes: number;
}