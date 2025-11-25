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
        
        let personaData: Persona | null = null;

        if (rol === 'docente') {
          // Para docentes: mantener la lógica actual
          const endpoint = 'http://127.0.0.1:8000/docentes/';
          
          const response = await fetch(endpoint);
          if (!response.ok) throw new Error('Error al cargar docentes');
          
          const docentes: any[] = await response.json();
          
          if (docentes.length > 0) {
            const docente = docentes[0];
            personaData = {
              id: docente.id,
              nombre: docente.persona.nombre,
              apellido: docente.persona.apellido,
              email: docente.persona.email,
              dni: "", 
              rol_id: 1,
              legajo: docente.persona.id
            };
          }
        } else {
          // Para alumnos: USAR DATOS DEL LOCALSTORAGE
          const alumnoId = localStorage.getItem('alumno_id');
          const alumnoNombre = localStorage.getItem('alumno_nombre');
          const alumnoApellido = localStorage.getItem('alumno_apellido');
          const alumnoEmail = localStorage.getItem('alumno_email');

          if (alumnoId && alumnoNombre && alumnoApellido) {
            // Si hay datos en localStorage, usarlos directamente
            personaData = {
              id: parseInt(alumnoId),
              nombre: alumnoNombre,
              apellido: alumnoApellido,
              email: alumnoEmail || '',
              dni: "",
              rol_id: 2,
              legajo: parseInt(alumnoId) // Puedes ajustar esto según tu lógica
            };
          } else {
            // Si no hay datos en localStorage, hacer fetch por ID específico
            const endpoint = `http://127.0.0.1:8000/personas/${alumnoId}`;
            
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('Error al cargar datos del alumno');
            
            const personaFromApi: Persona = await response.json();
            personaData = personaFromApi;
          }
        }

        if (personaData) {
          setPersona(personaData);
          setNombreCompleto(`${personaData.nombre} ${personaData.apellido}`);
        } else {
          throw new Error(`No se encontró ${rol === 'docente' ? 'docente' : 'alumno'}`);
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