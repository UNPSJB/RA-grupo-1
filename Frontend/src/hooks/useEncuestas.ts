import { useState, useEffect } from "react";

export enum EstadoEncuesta {
  ABIERTA = "abierta",
  CERRADA = "cerrada",
}

export enum Cursado {
    PrimerCuatrimestre = "cuatrimestre 1",
    SegundoCuatrimestre = "cuatrimestre 2",
    Anual = "Anual"
}

export interface Encuesta {
    id: number;
    asignatura: string;
    cursado: Cursado;
    estado: EstadoEncuesta;  
    fecha_fin: number;
}

export function useEncuestas() {
    const[encuestas, setEncuestas] = useState<Encuesta[]>([]);
    const[loading, setLoading] = useState<boolean>(true);
    const[error, setError] = useState<string | null>(null);
 
    const API_URL = "http://localhost:8000/encuestas"; 

    const fetchEncuestas = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            if (!response.ok) { 
                throw new Error("Error al conseguir las encuestas");
            }
            const data = await response.json();
            setEncuestas(data);
            setError(null);
        }catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }    

useEffect(() => {
    fetchEncuestas();
}, []);

return {
    encuestas,
    loading,
    error,
    refetch: fetchEncuestas 
    };
}