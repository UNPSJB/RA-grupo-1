import axios from "axios";

const API_URL = "http://127.0.0.1:8000/informes";

export interface Informe{
    id: number;
    sede: string;
    ciclo_lectivo: string;
    codigo_actividad_curricular: string;
    docente_responsable: string;
    cantidad_alumnos_inscriptos: number;
    cantidad_com_teoricas: number;
    cantidad_com_practicas: number;
    estado: string;
}

export interface InformeCreate extends Omit<Informe, "id"> {}

export const getInformes = async (): Promise<Informe[]> => {
    const response = await axios.get(API_URL);
    return response.data;
}

export const createInforme = async (informe: InformeCreate): Promise<Informe> => {
    const response = await axios.post(API_URL, informe);
    return response.data;
}

export const getInformeById = async (id:number): Promise<Informe> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
}