import { useState, useEffect } from 'react';

interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  rol_id: number;
  legajo: number;
}

export const usePersona = (rol?: string) => {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [nombreCompleto, setNombreCompleto] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersona = async () => {
      try {
        setLoading(true);
        
        let endpoint;
        let personaData: Persona | null = null;

        if (rol === 'docente') {
          // Usar endpoint específico para docentes
          endpoint = 'http://127.0.0.1:8000/docentes/';
          
          const response = await fetch(endpoint);
          if (!response.ok) throw new Error('Error al cargar docentes');
          
          const docentes: Persona[] = await response.json();
          
          // Tomar el primer docente disponible
          personaData = docentes.find(docente => docente.rol_id === 1) || docentes[0] || null;
          
        } else {
          // Usar endpoint para personas (alumnos)
          endpoint = 'http://127.0.0.1:8000/personas/';
          
          const response = await fetch(endpoint);
          if (!response.ok) throw new Error('Error al cargar personas');
          
          const personas: Persona[] = await response.json();
          
          // Para alumno, buscar rol_id = 2 o tomar la primera persona
          personaData = personas.find(persona => persona.rol_id === 2) || personas[0] || null;
        }

        if (personaData) {
          setPersona(personaData);
          setNombreCompleto(`${personaData.nombre} ${personaData.apellido}`);
        } else {
          throw new Error(`No se encontró ${rol === 'docente' ? 'docente' : 'persona'}`);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los datos del usuario');
        setLoading(false);
      }
    };

    fetchPersona();
  }, [rol]);

  return { 
    persona, 
    nombreCompleto,
    loading, 
    error 
  };
};