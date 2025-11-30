// Frontend/secretaria/services/informesSinteticosService.ts
import api from "../../../services/api";

export interface InformeSinteticoResumen {
  id: number;
  titulo: string;
  anio: number;
  duracion: string;
  departamento_nombre?: string;
  departamento_id: number;
  carrera_nombre?: string;
  carrera_id: number;
  sede?: string;
}


export async function getInformesSinteticosSecretaria() {
  const response = await api.get<InformeSinteticoResumen[]>(
    "/informes_sinteticos_finalizados/finalizados/"
  );
  return response.data;
}
