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
    const tryFetch = async () => {
      try {
        const res = await fetch(`${apiBase}/carreras`);
        if (!res.ok) throw new Error("Error al obtener carreras");
        const data = await res.json();
        setCarreras(data);
      } catch (err) {
        console.error("Error cargando carreras:", err);
        setMensaje("Error al obtener las carreras desde el backend.");
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
    const data = {
      id: c.id,
      nombre: c.nombre,
      departamento_id: c.departamento_id ?? null,
      facultad: c.facultad ?? null,
    };

    localStorage.setItem("carreraSeleccionada", JSON.stringify(data));
    setSeleccionadaId(c.id);

    window.dispatchEvent(new CustomEvent("carreraChanged", { detail: data }));
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-xl">

        {/* Título */}
        <h2 className="text-3xl font-bold text-center mb-6">
          Seleccionar carrera
        </h2>

        {/* Buscador */}
        <input
          className="border p-3 rounded-lg w-full mb-6 shadow-sm focus:ring-2 focus:ring-blue-400"
          placeholder="Buscar por nombre o facultad..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        {mensaje && <div className="mb-3 text-red-600">{mensaje}</div>}

        {/* GRID DE CARRERAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {carrerasFiltradas.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelect(c)}
              className={`
                p-4 rounded-xl border cursor-pointer transition-all
                hover:shadow-md hover:bg-blue-50
                ${seleccionadaId === c.id 
                  ? "border-blue-500 bg-blue-100 shadow" 
                  : "border-gray-200"}
              `}
            >
              <div className="font-semibold text-lg">{c.nombre}</div>
              <div className="text-sm text-gray-600">Código: {c.id}</div>
              {c.facultad && (
                <div className="text-sm text-gray-600">
                  Facultad: {c.facultad}
                </div>
              )}
            </div>
          ))}
        </div>

        {carrerasFiltradas.length === 0 && (
          <div className="mt-4 text-gray-500 text-center">
            No hay carreras que coincidan con el filtro.
          </div>
        )}
      </div>
    </div>
  );
}
