import { useState, useEffect, useCallback } from 'react';

interface EncuestaConTiempo {
  id: number;
  fecha_cierre: string;
  tiempoRestante?: {
    texto: string;
    haVencido: boolean;
    estaPorVencer: boolean;
  };
}

export const useContadorEncuestas = (encuestas: EncuestaConTiempo[]) => {
  const [encuestasActualizadas, setEncuestasActualizadas] = useState<EncuestaConTiempo[]>(encuestas);

  const calcularTiempoRestante = useCallback((fechaCierre: string) => {
    const ahora = new Date();
    const cierre = new Date(fechaCierre);
    const diferencia = cierre.getTime() - ahora.getTime();

    if (diferencia <= 0) {
      return {
        texto: 'Vencida',
        haVencido: true,
        estaPorVencer: false
      };
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

    const estaPorVencer = dias === 0 && horas < 24;

    let texto = '';
    if (dias > 0) {
      texto = `Cierra en ${dias} día${dias !== 1 ? 's' : ''}`;
    } else if (horas > 0) {
      texto = `Cierra en ${horas} hora${horas !== 1 ? 's' : ''}`;
    } else {
      texto = `Cierra en ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    }

    return {
      texto,
      haVencido: false,
      estaPorVencer
    };
  }, []);

  useEffect(() => {
    const actualizarTiempos = () => {
      setEncuestasActualizadas(prevEncuestas => 
        prevEncuestas.map(encuesta => ({
          ...encuesta,
          tiempoRestante: calcularTiempoRestante(encuesta.fecha_cierre)
        }))
      );
    };

    actualizarTiempos();
    
    const interval = setInterval(actualizarTiempos, 30000);

    return () => clearInterval(interval);
  }, [encuestas, calcularTiempoRestante]);

  return encuestasActualizadas;
};