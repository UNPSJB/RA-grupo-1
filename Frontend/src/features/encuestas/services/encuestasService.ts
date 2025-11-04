import { 
  FormularioEncuesta, 
  FormularioEncuestaCompleto 
} from '../types/encuestaTypes';

const API_BASE = 'http://localhost:8000';

export const encuestaService = {
  async obtenerFormularioEncuesta(encuestaId: number): Promise<FormularioEncuestaCompleto> {
    try {
      console.log(`📥 Obteniendo formulario de encuesta ${encuestaId}...`);
      
      // PRIMERO: Probar con el endpoint que sabemos que existe
      const response = await fetch(`${API_BASE}/encuestas/${encuestaId}/completar`);
      
      if (!response.ok) {
        // Si falla, probar con el endpoint alternativo
        console.warn(`⚠️ Endpoint /completar falló, probando alternativo...`);
        const responseAlt = await fetch(`${API_BASE}/encuestas/${encuestaId}/encuesta`);
        
        if (!responseAlt.ok) {
          const errorData = await responseAlt.json().catch(() => ({}));
          throw new Error(
            errorData.detail || `Error ${responseAlt.status}: No se pudo obtener el formulario`
          );
        }
        
        const data = await responseAlt.json();
        console.log('✅ Formulario obtenido (endpoint alternativo):', data);
        return data;
      }
      
      const data = await response.json();
      console.log('✅ Formulario obtenido:', data);
      return data;
    } catch (error) {
      console.error('❌ Error al obtener formulario:', error);
      throw error;
    }
  },

  async enviarRespuestasEncuesta(
    encuestaId: number, 
    alumnoId: number, 
    asignaturaId: number,
    respuestas: Record<number, string | string[] | boolean>
  ): Promise<void> {
    try {
      console.log('📤 Enviando respuestas...', {
        encuestaId,
        alumnoId, 
        asignaturaId,
        respuestas
      });

      // Usar el endpoint CORRECTO de tu backend
      const response = await fetch(`${API_BASE}/encuestas/respuestas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encuesta_id: encuestaId,
          alumno_id: alumnoId,
          respuestas: Object.entries(respuestas).map(([preguntaId, respuesta]) => ({
            pregunta_id: parseInt(preguntaId),
            texto: typeof respuesta === 'string' ? respuesta : undefined,
            valor: typeof respuesta === 'string' ? respuesta : undefined
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Error ${response.status}: No se pudieron enviar las respuestas`
        );
      }

      console.log('✅ Respuestas enviadas exitosamente');
    } catch (error) {
      console.error('❌ Error al enviar respuestas:', error);
      throw error;
    }
  }
};