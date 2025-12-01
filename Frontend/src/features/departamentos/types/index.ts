export enum EstadoInforme {
  ABIERTO = "abierto",
  CERRADO = "cerrado",
}

export interface Informe{
    sede: string;
    ciclo_lectivo: string;
    codigo_actividad_curricular: string;
    docente_responsable: string;
    cantidad_alumnos_inscriptos: number;
    cantidad_com_teoricas: number;
    cantidad_com_practicas: number;
    estado: EstadoInforme
}