import React, { useEffect, useState } from "react";
import { Search, CheckCircle2, Layers } from "lucide-react";

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
        const res = await fetch(`${apiBase}/carreras/con_informe_sintetico`);
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
    return (
      (c.nombre || "").toLowerCase().includes(q) ||
      (c.facultad || "").toLowerCase().includes(q)
    );
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
    <div className="w-full flex justify-center fade-in">
      <div className="
        bg-white/80 backdrop-blur-xl 
        shadow-2xl border border-gray-200
        rounded-2xl p-8 w-full max-w-2xl 
        transition-all duration-300
      ">
        
        {/* TITULO */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Layers size={32} className="text-blue-600 drop-shadow-sm" />
          <h2 className="text-3xl font-bold tracking-tight text-gray-800">
            Seleccionar Carrera
          </h2>
        </div>

        {/* BUSCADOR */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            className="
              w-full pl-12 pr-4 py-3 rounded-xl 
              bg-gray-100 focus:bg-white
              border border-gray-300 
              shadow-inner focus:ring-2 
              focus:ring-blue-400 focus:border-transparent
              transition-all
            "
            placeholder="Buscar por nombre o facultad..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        {mensaje && (
          <div className="mb-4 text-red-600 font-semibold bg-red-100 p-3 rounded-lg">
            {mensaje}
          </div>
        )}

        {/* LISTADO DE CARRERAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {carrerasFiltradas.map((c) => {
            const active = seleccionadaId === c.id;

            return (
              <div
                key={c.id}
                onClick={() => handleSelect(c)}
                className={`
                  p-5 rounded-xl cursor-pointer 
                  transition-all duration-300 border relative 
                  ${
                    active
                      ? "border-blue-500 bg-blue-100 shadow-md scale-[1.02]"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }
                `}
              >
                {/* Ícono de seleccionado */}
                {active && (
                  <CheckCircle2
                    size={24}
                    className="absolute top-3 right-3 text-blue-600"
                  />
                )}

                <div className="font-semibold text-lg text-gray-800">
                  {c.nombre}
                </div>

                <div className="text-sm text-gray-600 mt-1">
                  Código: {c.id}
                </div>

                {c.facultad && (
                  <div className="text-sm text-gray-600 mt-1">
                    Facultad: {c.facultad}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SIN RESULTADOS */}
        {carrerasFiltradas.length === 0 && (
          <div className="mt-6 text-center text-gray-500">
            No hay carreras que coincidan con el filtro.
          </div>
        )}
      </div>
    </div>
  );
}
