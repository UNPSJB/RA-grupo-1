import axios from "axios";
import api from "../../../services/api";

const API_URL = "http://127.0.0.1:8000/informe-catedra-finalizado";

export enum Duracion {
  anual = "anual",
  primer_cuat = "primer_cuat",
  segundo_cuat = "segundo_cuat"
}

const listarPendientes = (docenteId?: number) => {
  const params = docenteId ? `?docente_id=${docenteId}` : "";
  return api.get(`/informe_catedra/pending${params}`);
};

export default {
  listarPendientes,
};

export const normalizarDuracion = (d: string): Duracion => {
  if (!d) return d as Duracion;

  const val = d.toLowerCase();

  if (val.includes("primer")) return Duracion.primer_cuat;
  if (val.includes("segundo")) return Duracion.segundo_cuat;
  if (val.includes("anual")) return Duracion.anual;

  return d as Duracion;
};

// cabecera informacion informe
export interface InformePendienteCabecera {
    id: number;
    asignatura_docente_id: number;
    asignaturaNombre: string;
    asignaturaCodigo: string;
    informe_catedra_id: number;
    titulo: string | null;
    anio: number | null;
    duracion: Duracion | null;
    estado: string;
}

export interface InformeCatedraFinalizado {
    id: number;
    asignatura_docente_id: number;
    informe_catedra_id: number;
    titulo: string;
    contenido: string;
    cantidadAlumnos: number;
    anio: number;
    duracion: Duracion;
    cantidadComisionesTeoricas: number;
    cantidadComisionesPracticas: number;
    estado: string;
}

export interface InformeDetalle extends InformeCatedraFinalizado {
    resultado_informe: any[];
    asignaturaId: number;
    asignaturaNombre: string;
    asignaturaCodigo: string;
    docenteResponsable: string;
    informe_catedra_base_id: number;
}

export interface InformeFinalizadoCabecera {
  id: number;
  titulo: string;
  asignaturaNombre: string;
  asignaturaCodigo: string;
  estado: string;
  informe_catedra_id: number;
}

export interface RespuestaInformePost {
  pregunta_id: number;
  opcion_id?: number | null;
  texto_respuesta?: string | null;
}

export const guardarBorradorInforme = async (informeId: number, data: { respuestas: RespuestaInformePost[] }) => {
  const response = await axios.put(`${API_URL}/${informeId}/borrador`, data);
  return response.data;
};

export const getInformeFinalizadoDetalle = async (id: number) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data; // incluye respuestas_informe
};

export const finalizarInforme = async (informeId: number) => {
  const response = await axios.put(`${API_URL}/${informeId}/finalizar`);
  return response.data;
};

export const enviarRespuestasInforme = async (informeFinalizadoId: number, respuestas: RespuestaInformePost[]) => {
  return axios.post(`${API_URL}/${informeFinalizadoId}/respuestas`, respuestas);
};

export const getInformesFinalizadosCabecera = async (docenteId: number): Promise<InformeFinalizadoCabecera[]> => {
  const res = await axios.get(`${API_URL}/docente/${docenteId}/finalizados-cabecera`);
  return res.data;
};

export const getInformesFinalizadosPorDocente = async (docenteId: number) => {
    const response = await axios.get(`${API_URL}/docente/${docenteId}/finalizados`);

    return response.data.map((x: any) => ({
        ...x,
        duracion: normalizarDuracion(x.duracion),
    }));
};

export const getInformesPendientesCabecera = async (docenteId: number): Promise<InformePendienteCabecera[]> => {
    const response = await axios.get(`${API_URL}/docente/${docenteId}/pendientes-cabecera`);
    return response.data;
};

export const getInformeById = async (id: number): Promise<InformeDetalle> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export interface InformeCreate extends Omit<InformeCatedraFinalizado, "id"> {}

export const createInforme = async (informe: InformeCreate): Promise<InformeCatedraFinalizado> => {
    const response = await axios.post(API_URL, informe);
    return response.data;
};
