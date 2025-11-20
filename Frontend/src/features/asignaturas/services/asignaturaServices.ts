import { Asignatura, DetalleAsignatura } from '../types/asignaturaTypes';

// DATOS HARCODEADOS LLAMAR CON LA API
const asignaturasMock: Asignatura[] = [
  { id: 1, nombre: 'Matemáticas Avanzadas', matricula: 'MAT-2025-001' },
  { id: 2, nombre: 'Física Cuántica', matricula: 'FIS-2025-002' },
  { id: 3, nombre: 'Programación Web', matricula: 'PROG-2025-003' },
];

const detallesMock: { [key: string]: DetalleAsignatura } = {
  '1': {
    id: 1,
    nombre: 'Matemáticas Avanzadas',
    matricula: 'MAT-2025-001',
    descripcion: 'Curso avanzado de matemáticas para estudiantes de ingeniería',
    profesor: 'Dr. Juan Pérez',
    horario: 'Lunes y Miércoles 10:00 - 12:00',
    aula: 'A-201',
    creditos: 4,
    estudiantesInscritos: 35,
    estado: 'Activa'
  },
  '2': {
    id: 2,
    nombre: 'Física Cuántica',
    matricula: 'FIS-2025-002',
    descripcion: 'Introducción a los principios de la física cuántica',
    profesor: 'Dra. María García',
    horario: 'Martes y Jueves 14:00 - 16:00',
    aula: 'B-105',
    creditos: 3,
    estudiantesInscritos: 28,
    estado: 'Activa'
  }
};

export const asignaturaService = {
  async obtenerAsignaturas(docenteId?: number): Promise<Asignatura[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // return await api.get(`/asignaturas?docenteId=${docenteId}`);
    
    return asignaturasMock;
  },

  async obtenerDetalleAsignatura(id: string): Promise<DetalleAsignatura> {
    await new Promise(resolve => setTimeout(resolve, 800));
    

    // return await api.get(`/asignaturas/${id}`);
    
    const detalle = detallesMock[id];
    if (!detalle) {
      throw new Error('Asignatura no encontrada');
    }
    return detalle;
  },

  async inscribirEstudiante(asignaturaId: number, estudianteId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Estudiante ${estudianteId} inscrito en asignatura ${asignaturaId}`);
  }
};