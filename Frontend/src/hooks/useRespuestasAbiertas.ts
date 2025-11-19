import { useState, useEffect } from "react";
import { RespuestaAbierta } from "../types/types";
import { FiltrosRespuestas } from "../types/types";

export function useRespuestasAbiertas() {
  const [respuestas, setRespuestas] = useState<RespuestaAbierta[]>([]);
  const [respuestasFiltradas, setRespuestasFiltradas] = useState<RespuestaAbierta[]>([]);
  const [filtros, setFiltros] = useState<FiltrosRespuestas>({
    asignaturaId: null,
    sentimiento: null,
    busqueda: ''
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const datosHardcoded: RespuestaAbierta[] = [
    {
      id: 1,
      pregunta: '¿Qué aspectos de la asignatura te parecieron más valiosos?',
      respuesta: 'La explicación de los patrones de diseño fue excelente. El profesor utiliza ejemplos prácticos que ayudan a entender mejor los conceptos. Me gustó mucho el enfoque hands-on de la asignatura.',
      asignatura: 'Desarrollo de Software',
      asignaturaId: 1,
      fecha: '2024-10-05',
      sentimiento: 'positivo',
      categoria: 'Metodología'
    },
    {
      id: 2,
      pregunta: '¿Qué sugerencias tienes para mejorar la asignatura?',
      respuesta: 'Sería útil tener más tiempo para los trabajos prácticos. A veces sentí que las entregas estaban muy juntas y no daba el tiempo suficiente para profundizar en los temas.',
      asignatura: 'Desarrollo de Software',
      asignaturaId: 1,
      fecha: '2024-10-04',
      sentimiento: 'neutral',
      categoria: 'Organización'
    },
    {
      id: 3,
      pregunta: '¿Cómo calificarías la comunicación del docente?',
      respuesta: 'Excelente comunicación. El profesor siempre está disponible para consultas y responde rápido por los canales de comunicación. Explica con claridad y paciencia.',
      asignatura: 'Desarrollo de Software',
      asignaturaId: 1,
      fecha: '2024-10-03',
      sentimiento: 'positivo',
      categoria: 'Comunicación'
    },
    {
      id: 4,
      pregunta: '¿Qué aspectos de la asignatura te parecieron más valiosos?',
      respuesta: 'Los ejercicios de algoritmos fueron desafiantes pero muy educativos. Me ayudaron a pensar de manera más lógica y estructurada. La teoría está bien balanceada con la práctica.',
      asignatura: 'Algoritmos y Estructuras de Datos',
      asignaturaId: 3,
      fecha: '2024-10-02',
      sentimiento: 'positivo',
      categoria: 'Contenido'
    },
    {
      id: 5,
      pregunta: '¿Qué sugerencias tienes para mejorar la asignatura?',
      respuesta: 'Los parciales son muy difíciles. Creo que deberían estar más alineados con lo que vemos en clase. A veces hay preguntas que no se cubrieron lo suficiente en las clases.',
      asignatura: 'Algoritmos y Estructuras de Datos',
      asignaturaId: 3,
      fecha: '2024-10-01',
      sentimiento: 'negativo',
      categoria: 'Evaluación'
    },
    {
      id: 6,
      pregunta: '¿Cómo calificarías los recursos y asignaturales de estudio?',
      respuesta: 'El asignatural está muy completo. Las presentaciones son claras y los videos complementarios son de gran ayuda. También los ejercicios adicionales están muy buenos.',
      asignatura: 'Ingeniería de Software',
      asignaturaId: 2,
      fecha: '2024-09-30',
      sentimiento: 'positivo',
      categoria: 'asignaturales'
    },
    {
      id: 7,
      pregunta: '¿Qué aspectos de la asignatura te parecieron más valiosos?',
      respuesta: 'Me gustó el enfoque en metodologías ágiles. Es muy aplicable al mundo laboral real. Las dinámicas de grupo también fueron muy enriquecedoras.',
      asignatura: 'Ingeniería de Software',
      asignaturaId: 2,
      fecha: '2024-09-29',
      sentimiento: 'positivo',
      categoria: 'Metodología'
    },
    {
      id: 8,
      pregunta: '¿Qué sugerencias tienes para mejorar la asignatura?',
      respuesta: 'Tal vez incluir más casos de estudio de proyectos reales. Sería interesante ver ejemplos de empresas conocidas y cómo aplican estos conceptos.',
      asignatura: 'Ingeniería de Software',
      asignaturaId: 2,
      fecha: '2024-09-28',
      sentimiento: 'neutral',
      categoria: 'Contenido'
    },
    {
      id: 9,
      pregunta: '¿Cómo fue tu experiencia general con la asignatura?',
      respuesta: 'Una de las mejores asignaturas que cursé. El profesor demuestra pasión por lo que enseña y eso se transmite. Aprendí mucho y me siento preparado para aplicar estos conocimientos.',
      asignatura: 'Desarrollo de Software',
      asignaturaId: 1,
      fecha: '2024-09-27',
      sentimiento: 'positivo',
      categoria: 'General'
    },
    {
      id: 10,
      pregunta: '¿Qué aspectos consideras que necesitan mejora?',
      respuesta: 'El ritmo de la clase a veces es muy rápido. Sería bueno dedicar más tiempo a los conceptos más complejos como recursión y árboles.',
      asignatura: 'Algoritmos y Estructuras de Datos',
      asignaturaId: 3,
      fecha: '2024-09-26',
      sentimiento: 'neutral',
      categoria: 'Metodología'
    }
  ];

    useEffect(() => {
    const fetchRespuestas = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setRespuestas(datosHardcoded);
        setRespuestasFiltradas(datosHardcoded);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRespuestas();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...respuestas];

    // Filtrar por asignatura
    if (filtros.asignaturaId !== null) {
      filtered = filtered.filter(r => r.asignaturaId === filtros.asignaturaId);
    }

    // Filtrar por sentimiento
    if (filtros.sentimiento !== null && filtros.sentimiento !== 'todos') {
      filtered = filtered.filter(r => r.sentimiento === filtros.sentimiento);
    }

    // Filtrar por búsqueda
    if (filtros.busqueda.trim() !== '') {
      const busquedaLower = filtros.busqueda.toLowerCase();
      filtered = filtered.filter(r => 
        r.respuesta.toLowerCase().includes(busquedaLower) ||
        r.pregunta.toLowerCase().includes(busquedaLower)
      );
    }

    setRespuestasFiltradas(filtered);
  }, [filtros, respuestas]);

  const actualizarFiltros = (nuevosFiltros: Partial<FiltrosRespuestas>) => {
    setFiltros(prev => ({ ...prev, ...nuevosFiltros }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      asignaturaId: null,
      sentimiento: null,
      busqueda: ''
    });
  };

  return {
    respuestas: respuestasFiltradas,
    loading,
    error,
    filtros,
    actualizarFiltros,
    limpiarFiltros,
    totalRespuestas: respuestas.length,
    totalFiltradas: respuestasFiltradas.length
  };
}
