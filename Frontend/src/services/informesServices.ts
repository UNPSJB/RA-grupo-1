import axios from "axios";

export interface Informe {
  id?: number;
  sede: string;
  ciclo_lectivo: string;
  codigo_actividad_curricular: string;
  docente_responsable: string;
  cantidad_alumnos_inscriptos: number;
  cantidad_com_teoricas: number;
  cantidad_com_practicas: number;
  comision?: string;
  modalidad?: string;
  observaciones?: string;
  estado: string; // "abierto" | "cerrado"
}

const API_URL = "http://localhost:8000/informes";

export const getInformes = async (): Promise<Informe[]> => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

export const crearInforme = async (informe: Informe): Promise<Informe> => {
  const response = await axios.post(`${API_URL}/`, informe);
  return response.data;
};
