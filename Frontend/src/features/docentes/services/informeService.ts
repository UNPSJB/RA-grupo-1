import axios from "axios";

const API_URL = "http://127.0.0.1:8000/informe-catedra-finalizado";

export enum Duracion {
    anual = "anual",
    cuatrimestre_1 = "primer cuatrimestre",
    cuatrimestre_2 = "segundo cuatrimestre"
}    

export interface Informe{
    id: number;
    asignatura_docente_id: number;
    informe_catedra_id: number;
    titulo: string;
    contenido:string;
    cantidadAlumnos: number;
    anio: number;
    duracion: Duracion;
    cantidadComisionesTeoricas: number;
    cantidadComisionesPracticas: number;
}

export interface InformeCreate extends Omit<Informe, "id"> {}

export const getInformesFinalizadosPorDocente = async (docenteId: number): Promise<Informe[]> => {
    const response = await axios.get(`${API_URL}/docente/${docenteId}/finalizados`);
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