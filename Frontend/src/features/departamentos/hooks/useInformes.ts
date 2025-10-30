import { useState, useEffect } from "react";

export enum EstadoInforme {
  ABIERTO = "abierto",
  CERRADO = "cerrado",
}

export interface Informe{
    id: number;
    sede: string;
    ciclo_lectivo: string;
    codigo_actividad_curricular: string;
    docente_responsable: string;
    cantidad_alumnos_inscriptos: number;
    cantidad_com_teoricas: number;
    cantidad_com_practicas: number;
    estado: EstadoInforme
}

export function useInformes(){

    const[informes, setInformes] = useState<Informe[]>([]);
    const[loading, setLoading] = useState<boolean>(true);
    const[error, setError] = useState<string | null>(null);
 
    const API_URL = "http://localhost:8000/informes"; 

    const fetchInformes = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            if (!response.ok) { 
                throw new Error("Error al conseguir las informes");
            }
            const data = await response.json();
            setInformes(data);
            setError(null);
        }catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }    


useEffect(() => {
    fetchInformes();
}, []);

return {
    informes,
    loading,
    error,
    refetch: fetchInformes 
    };
}