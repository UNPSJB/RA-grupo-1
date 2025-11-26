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
