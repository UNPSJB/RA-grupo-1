export interface InformeCatedra {
  id: number;
  titulo?: string;
  descripcion?: string;
  asignatura_nombre?: string;
  ciclo_nombre?: string;
  fecha_apertura?: string;
  fecha_cierre?: string;
  estado?: "PENDIENTE" | "COMPLETADO";
}

export interface CategoriaTemp {
  codigo: string;
  texto: string;
}

export interface PreguntaTemp {
  enunciado: string;
  categoria_codigo: string;            
  tipo: 'abierta' | 'cerrada';
  opcion_ids: number[];
}