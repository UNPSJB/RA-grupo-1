import api from './api';

export interface RespuestaAbierta {
  id: number;
  pregunta_id: number;
  texto_pregunta: string;
  respuesta_texto: string;
  fecha_respuesta: string;
  encuesta_id: number;
  anonima: boolean;
}

class RespuestasService {
  async getRespuestasAbiertas(materiaId?: string): Promise<RespuestaAbierta[]> {
    const url = materiaId 
      ? `/respuestas/abiertas/materia/${materiaId}`
      : '/respuestas/abiertas';
    
    const response = await api.get(url);
    return response.data;
  }

  async getRespuestasAbiertasPorEncuesta(encuestaId: number): Promise<RespuestaAbierta[]> {
    const response = await api.get(`/respuestas/abiertas/encuesta/${encuestaId}`);
    return response.data;
  }
}

export default new RespuestasService();