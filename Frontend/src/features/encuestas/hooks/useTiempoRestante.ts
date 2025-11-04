// hooks/useTiempoRestante.ts
import { useState, useEffect } from 'react';

interface TiempoRestante {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  estaProximoVencer: boolean;
  estaPorVencer: boolean;
  haVencido: boolean;
  texto: string;
}

export const useTiempoRestante = (fechaCierre: string): TiempoRestante => {
  const [tiempoRestante, setTiempoRestante] = useState<TiempoRestante>({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
    estaProximoVencer: false,
    estaPorVencer: false,
    haVencido: false,
    texto: ''
  });

  useEffect(() => {
    const calcularTiempoRestante = () => {
      const ahora = new Date();
      const cierre = new Date(fechaCierre);
      const diferencia = cierre.getTime() - ahora.getTime();

      if (diferencia <= 0) {
        setTiempoRestante({
          dias: 0,
          horas: 0,
          minutos: 0,
          segundos: 0,
          estaProximoVencer: false,
          estaPorVencer: false,
          haVencido: true,
          texto: 'Vencida'
        });
        return;
      }

      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
      const estaProximoVencer = dias <= 3 && dias > 1; 
      const estaPorVencer = dias === 0 && horas < 24; 
      const haVencido = false;

      // texto formateado
      let texto = '';
      if (dias > 0) {
        texto = `Cierra en ${dias} día${dias !== 1 ? 's' : ''}`;
        if (horas > 0 && dias === 1) {
          texto += ` y ${horas} hora${horas !== 1 ? 's' : ''}`;
        }
      } else if (horas > 0) {
        texto = `Cierra en ${horas} hora${horas !== 1 ? 's' : ''}`;
        if (minutos > 0 && horas === 1) {
          texto += ` y ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
        }
      } else if (minutos > 0) {
        texto = `Cierra en ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
      } else {
        texto = `Cierra en ${segundos} segundo${segundos !== 1 ? 's' : ''}`;
      }

      setTiempoRestante({
        dias,
        horas,
        minutos,
        segundos,
        estaProximoVencer,
        estaPorVencer,
        haVencido,
        texto
      });
    };

    calcularTiempoRestante();

    // Actualizar cada segundo
    const interval = setInterval(calcularTiempoRestante, 1000);

    return () => clearInterval(interval);
  }, [fechaCierre]);

  return tiempoRestante;
};