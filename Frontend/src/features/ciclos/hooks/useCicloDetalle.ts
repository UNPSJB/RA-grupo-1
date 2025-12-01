import { useEffect, useState } from "react";

interface Ciclo {
  id: number;
  nombre: string;
  descripcion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  activo: boolean;
}

interface Encuesta {
  id: number;
  titulo: string;
}

export function useCicloDetalle(cicloId: number | string | undefined) {
  const [ciclo, setCiclo] = useState<Ciclo | null>(null);
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [asignadas, setAsignadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!cicloId) return;
    cargarDatos();
  }, [cicloId]);

  async function cargarDatos() {
    setLoading(true);

    try {
      const base = "http://127.0.0.1:8000";

      // Traer ciclo
      const cicloRes = await fetch(`${base}/ciclos/${cicloId}`);
      const cicloData = await cicloRes.json();
      setCiclo(cicloData);

      // Traer todas las encuestas del sistema
      const encuestasRes = await fetch(`${base}/encuestas/`);
      const encuestasData = await encuestasRes.json();
      setEncuestas(encuestasData);

      // Traer encuestas asignadas al ciclo
      const asignadasRes = await fetch(`${base}/ciclos/${cicloId}/encuestas_asignadas`);
      const asignadasData = await asignadasRes.json();

      setAsignadas(asignadasData);
    } catch (err) {
      console.error("Error cargando ciclo:", err);
    } finally {
      setLoading(false);
    }
  }

  function toggleEncuesta(id: number) {
    setAsignadas(prev =>
      prev.includes(id)
        ? prev.filter(e => e !== id)
        : [...prev, id]
    );
  }

  async function guardar() {
    if (!cicloId) return;
    setSaving(true);

    try {
      const base = "http://127.0.0.1:8000";

      await fetch(`${base}/ciclos/${cicloId}/encuestas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asignadas),
      });

      await cargarDatos();
    } catch (err) {
      console.error("Error guardando:", err);
    } finally {
      setSaving(false);
    }
  }

  return {
    ciclo,
    encuestas,
    asignadas,
    toggleEncuesta,
    guardar,
    loading,
    saving
  };
}
