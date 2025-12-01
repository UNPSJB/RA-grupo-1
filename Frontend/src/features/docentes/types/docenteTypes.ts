import { Asignatura } from "../../asignaturas/types/asignaturaTypes";

export interface Docente {
  docente_id: number;
  nombre: string;
  apellido: string;
  asignaturas: Asignatura[];
}