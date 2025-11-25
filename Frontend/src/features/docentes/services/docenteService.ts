import axios from "axios";

const API_URL = "http://127.0.0.1:8000/docentes";

export interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  rol_id: number;
  legajo: number;
  cuil: string;
  usuario: string;
  clave: string;
}

export interface Docente {
  persona_id: number;
  id: number;
  persona: Persona;
}

export interface DocenteStats {
  total_asignaturas: number;
  total_estudiantes: number;
  encuestas_finalizadas: number;
  evaluacion_promedio: number;
  semestre_actual: string;
}

export interface DocenteCreate extends Omit<Docente, "id"> {}

export const getDocenteById = async (id: number): Promise<Docente> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

// simulado por ahora
export const docenteService = {
  getDocenteStats: async (docenteId: number): Promise<DocenteStats> => {
    return {
      total_asignaturas: 5,
      total_estudiantes: 150,
      encuestas_finalizadas: 120,
      evaluacion_promedio: 3.8,
      semestre_actual: "2025-1"
    };
  }
};