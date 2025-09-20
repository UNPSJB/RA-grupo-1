import { useState, useEffect } from "react";

export interface Persona {
    id: number;
    nombre: string;
}

export function usePersona() {
    const [persona, setPersona] = useState<Persona | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = "http://127.0.0.1:8000/personas";

    const fetchPersona = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error("Error al obtener los datos de la persona");
            }
            const data = await response.json();
            
            // Si la API devuelve un array, tomar el primer elemento
            // Si devuelve un objeto directamente, usa el data
            const personaData = Array.isArray(data) ? data[0] : data;
            
            setPersona(personaData);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            setPersona(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPersona();
    }, []);

    return {
        persona,
        loading,
        error,
        refetch: fetchPersona
    };
}