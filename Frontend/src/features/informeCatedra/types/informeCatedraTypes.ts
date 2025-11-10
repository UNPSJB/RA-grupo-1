export interface CategoriaTemp {
  codigo: string;
  texto: string;
}

export interface PreguntaTemp {
  enunciado: string;
  categoria_codigo: string;            // clave consistente
  tipo: 'abierta' | 'cerrada';
  nro_pregunta: number
  opcion_ids: number[];
}
