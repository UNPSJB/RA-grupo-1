import api from './api';

export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  semestre: string;
  carrera: string;
  sede: string;
  total_estudiantes: number;
  encuestas_completadas: number;
  promedio_general: number;
  encuestas_pendientes?: number;
}

class MateriasService {
  async getMateriasByDocente(docenteId: number): Promise<Materia[]> {
    const response = await api.get(`/docentes/${docenteId}/materias`);
    return response.data;
  }

  async getMateriaDetalle(materiaId: number): Promise<Materia> {
    const response = await api.get(`/materias/${materiaId}`);
    return response.data;
  }

  async getEstadisticasMateria(materiaId: number) {
    const response = await api.get(`/materias/${materiaId}/estadisticas`);
    return response.data;
  }
}

export default new MateriasService();