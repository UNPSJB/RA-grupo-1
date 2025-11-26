import { useEffect, useState } from "react";

const API = "http://localhost:8000";

export function useMetricasDepartamento(departamentoId: number) {
  const [metricas, setMetricas] = useState({
    carrerasActivas: 0,
    informesPendientes: 0,
    informesCompletados: 0,
  });

  useEffect(() => {
    async function cargarMetricas() {
      // === 1. Carreras activas ===
      const resCarr = await fetch(`${API}/carreras/?departamento_id=${departamentoId}`);
      const carreras = await resCarr.json();

      // === 2. Informes completados ===
      const resComp = await fetch(`${API}/informes_sinteticos_finalizados/finalizados/`);
      const informesFinalizados = await resComp.json();

      // === 3. Informes pendientes ===
      let pendientes = 0;

      for (const carrera of carreras) {
        const resBase = await fetch(`${API}/informes_sinteticos?carrera_id=${carrera.id}`);
        const informesBase = await resBase.json();

        for (const inf of informesBase) {
          const check = await fetch(
            `${API}/informes_sinteticos_finalizados/finalizados/completado?carrera_id=${carrera.id}&informe_base_id=${inf.id}`
          );
          const estado = await check.json();
          if (!estado.completado) pendientes++;
        }
      }

      setMetricas({
        carrerasActivas: carreras.length,
        informesPendientes: pendientes,
        informesCompletados: informesFinalizados.length,
      });
    }

    cargarMetricas();
  }, [departamentoId]);

  return metricas;
}
