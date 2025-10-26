import { Carrera } from "../../carreras/types/carrerasTypes";

export interface Departamento {
  id: number;
  nombre: string;
  carreras: Carrera[];
}