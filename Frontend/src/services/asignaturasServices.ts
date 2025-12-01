import api from './api';

export interface Asignatura {
  id: number;
  nombre: string;
  codigo: string;
  semestre: string;
  carrera: string;
  sede: string;
  total_estudiantes: number;
  encuestas_finalizadas: number;
  promedio_general: number;
  encuestas_pendientes?: number;
}

class AsignaturasService {
  async getAsignaturasByDocente(docenteId: number): Promise<Asignatura[]> {
    const response = await api.get(`/docentes/${docenteId}/asignaturas`);
    return response.data;
  }

  async getAsignaturaDetalle(asignaturaId: number): Promise<Asignatura> {
    const response = await api.get(`/asignaturas/${asignaturaId}`);
    return response.data;
  }

  async getEstadisticasAsignatura(asignaturaId: number) {
    const response = await api.get(`/asignaturas/${asignaturaId}/estadisticas`);
    return response.data;
  }
}

export default new AsignaturasService();