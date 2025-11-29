import React, { useEffect, useState } from "react";

type Carrera = {
  id: number;
  nombre: string;
  departamento_id?: number;
};

export default function SeleccionCarrera() {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [filtro, setFiltro] = useState("");
  const [seleccionadaId, setSeleccionadaId] = useState<number | null>(() => {
    try {
      const raw = localStorage.getItem("carreraSeleccionada");
      if (!raw) return null;
      const obj = JSON.parse(raw);
      return obj?.id ?? null;
    } catch {
      return null;
    }
  });

  const [mensaje, setMensaje] = useState<string | null>(null);
  const apiBase = "http://127.0.0.1:8000";

  // ================================================
  //    CARGAR SOLO CARRERAS CON INFORMES PENDIENTES
  // ================================================
  useEffect(() => {
    const tryFetch = async () => {
      try {
        const res = await fetch(`${apiBase}/carreras/informes_pendientes_global`);
        if (!res.ok) throw new Error("Error al obtener carreras");
        const data = await res.json();

        setCarreras(data);

        // si la carrera seleccionada no está más disponible → limpiar
        const raw = localStorage.getItem("carreraSeleccionada");
        if (raw) {
          const old = JSON.parse(raw);
          const stillExists = data.some((c: Carrera) => c.id === old.id);
          if (!stillExists) {
            localStorage.removeItem("carreraSeleccionada");
            setSeleccionadaId(null);
          }
        }
      } catch (err) {
        console.error("Error cargando carreras:", err);
        setMensaje("Error al obtener las carreras desde el backend.");
      }
    };

    tryFetch();
  }, []);

  // ================================================
  // ------------ FILTRO (buscador) -----------------
  // ================================================
  const carrerasFiltradas = carreras.filter((c) => {
    const q = filtro.trim().toLowerCase();
    if (!q) return true;
    const nombre = (c.nombre || "").toLowerCase();
    return nombre.includes(q);
  });

  // ================================================
  //           HANDLER SELECCIONAR CARRERA
  // ================================================
  const handleSelect = (c: Carrera) => {
    const data = {
      id: c.id,
      nombre: c.nombre,
      departamento_id: c.departamento_id ?? null,
    };

    localStorage.setItem("carreraSeleccionada", JSON.stringify(data));
    setSeleccionadaId(c.id);

    // para actualizar componentes externos si escuchan el evento
    window.dispatchEvent(new CustomEvent("carreraChanged", { detail: data }));
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-xl">

        <h2 className="text-3xl font-bold text-center mb-6">
          Seleccionar carrera
        </h2>

        <input
          className="border p-3 rounded-lg w-full mb-6 shadow-sm focus:ring-2 focus:ring-blue-400"
          placeholder="Buscar por nombre..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        {mensaje && <div className="mb-3 text-red-600">{mensaje}</div>}

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
            </div>
          ))}
        </div>

        {carrerasFiltradas.length === 0 && (
          <div className="mt-4 text-gray-500 text-center">
            No hay carreras que coincidan con el filtro.
          </div>
        )}

        {/* Mostrar selección solo si existe */}
        {seleccionadaId && (
          <div className="mt-6 text-center text-gray-700 font-medium">
            Carrera seleccionada:{" "}
            {carreras.find((c) => c.id === seleccionadaId)?.nombre}
          </div>
        )}
      </div>
    </div>
  );
}
