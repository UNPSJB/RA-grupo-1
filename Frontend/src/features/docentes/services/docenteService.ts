export interface Docente {
  id: number;
  nombre: string;
}

export interface DocenteStats {
  total_materias: number;
  total_estudiantes: number;
  encuestas_completadas: number;
  evaluacion_promedio: number;
  semestre_actual: string;
}

// simulado por ahora
export const docenteService = {
  getDocenteStats: async (docenteId: number): Promise<DocenteStats> => {
    return {
      total_materias: 5,
      total_estudiantes: 150,
      encuestas_completadas: 120,
      evaluacion_promedio: 3.8,
      semestre_actual: "2025-1"
    };
  }
};