import React, { useEffect, useState } from "react";

type Carrera = {
  id: number;
  nombre: string;
  departamento_id?: number;
  facultad?: string | null;
};

export default function SeleccionCarrera() {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [filtro, setFiltro] = useState("");
  const [seleccionadaId, setSeleccionadaId] = useState<number | null>(() => {
    try {
      const raw = localStorage.getItem("carreraSeleccionada");
      if (!raw) return null;
      const obj = JSON.parse(raw) as Carrera;
      return obj?.id ?? null;
    } catch {
      return null;
    }
  });
  const [mensaje, setMensaje] = useState<string | null>(null);
  const apiBase = "http://127.0.0.1:8000";
  useEffect(() => {
    // Intentar primero la ruta con facultad. Si falla, usar /carreras.
    const tryFetch = async () => {
      try {
        const res = await fetch(`${apiBase}/carreras/con-facultad`);
        if (!res.ok) throw new Error("sin /con-facultad");
        const data = await res.json();
        setCarreras(data);
        return;
      } catch {
        try {
          const res2 = await fetch(`${apiBase}/carreras`);
          if (!res2.ok) throw new Error("no /carreras");
          const data2 = await res2.json();
          setCarreras(data2);
        } catch (err) {
          console.error("Error cargando carreras:", err);
          setMensaje("Error al obtener las carreras desde el backend.");
        }
      }
    };
    tryFetch();
  }, []);

  const carrerasFiltradas = carreras.filter((c) => {
    const q = filtro.trim().toLowerCase();
    if (!q) return true;
    const nombre = (c.nombre || "").toLowerCase();
    const facultad = (c.facultad || "").toLowerCase();
    return nombre.includes(q) || facultad.includes(q);
  });

  const handleSelect = (c: Carrera) => {
    localStorage.setItem("carreraSeleccionada", JSON.stringify(c));
    setSeleccionadaId(c.id);
    // emitir evento global opcional
    window.dispatchEvent(new CustomEvent("carreraChanged", { detail: c }));
    setMensaje(`✅ Carrera guardada: ${c.nombre}`);
    // redirigir al módulo de informes (ajusta la ruta si es otra)
    setTimeout(() => {
      window.location.href = "/departamento/informes";
    }, 700);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Seleccionar carrera</h2>

      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="Buscar por nombre o facultad..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {mensaje && <div className="mb-3 text-green-600">{mensaje}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {carrerasFiltradas.map((c) => (
          <div
            key={c.id}
            onClick={() => handleSelect(c)}
            className={`p-4 rounded-lg border cursor-pointer hover:shadow ${
              seleccionadaId === c.id ? "border-green-500 bg-green-50" : "border-gray-200"
            }`}
          >
            <div className="font-medium text-lg">{c.nombre}</div>
            <div className="text-sm text-gray-600">Código: {c.id}</div>
            {c.facultad && <div className="text-sm text-gray-600">Facultad: {c.facultad}</div>}
          </div>
        ))}
      </div>

      {carrerasFiltradas.length === 0 && (
        <div className="mt-4 text-gray-500">No hay carreras que coincidan con el filtro.</div>
      )}
    </div>
  );
}
