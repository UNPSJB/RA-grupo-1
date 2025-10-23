export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'alumno' | 'docente' | 'departamento' | 'secretaria';
  activo: boolean;
  fechaCreacion: string;
}

export interface Carrera {
  id: number;
  nombre: string;
  codigo: string;
  departamento: string;
  cantidadMaterias: number;
  activa: boolean;
}

export interface EstadisticasGenerales {
  totalUsuarios: number;
  totalAlumnos: number;
  totalDocentes: number;
  totalEncuestasCompletadas: number;
  totalEncuestasPendientes: number;
  carrerasActivas: number;
}