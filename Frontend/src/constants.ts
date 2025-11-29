export const ANIO_ACTUAL = 2025;
export const PERIODO_ACTUAL = "SEGUNDO_CUATRI";
export const DOCENTE_ID = 1; 
export const CARRERA_ID = 1; 
export const ALUMNO_ID = 8;

export function MostrarPeriodo(p: string) {
  switch (p) {
    case "PRIMER_CUATRI":
      return "Primer Cuatrimestre"; 
    case "SEGUNDO_CUATRI":
      return "Segundo Cuatrimestre";    
    default:
      return p;
  }     
}