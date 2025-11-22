import React, { useEffect, useState } from "react";

type Carrera = {
  id: number;
  nombre: string;
  departamento_id?: number;
};

type Informe = {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  carrera_id?: number;
};

const API_BASE = "http://127.0.0.1:8000"; // ajustá si usás otro host o puerto

export default function InformeSinteticoPage() {
  const [carrera, setCarrera] = useState<Carrera | null>(null);
  const [informes, setInformes] = useState<Informe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nuevo, setNuevo] = useState({ titulo: "", contenido: "" });

  // Cargar la carrera seleccionada
  useEffect(() => {
    try {
      const raw = localStorage.getItem("carreraSeleccionada");
      if (raw) {
        const parsed = JSON.parse(raw);
        setCarrera(parsed);
      } else {
        setCarrera(null);
      }
    } catch (e) {
      console.error("Error leyendo carrera seleccionada:", e);
      setCarrera(null);
    }
  }, []);

  // cargar informes de la carrera seleccionada
  useEffect(() => {
    if (!carrera) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_BASE}/informes?carrera_id=${carrera.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener informes");
        return res.json();
      })
      .then((data) => {
        setInformes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [carrera]);

  // crear un nuevo informe
  const handleCrearInforme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevo.titulo || !nuevo.contenido || !carrera) return;

    try {
      const body = {
        ...nuevo,
        fecha: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
        carrera_id: carrera.id,
      };

      const res = await fetch(`${API_BASE}/informes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error al crear informe");
      const created = await res.json();

      // actualiza la lista sin recargar
      setInformes((prev) => [...prev, created]);
      setNuevo({ titulo: "", contenido: "" });
    } catch (err) {
      console.error(err);
      alert("No se pudo crear el informe");
    }
  };

  if (!carrera) {
    return (
      <div className="p-4">
        <h3>No hay carrera seleccionada</h3>
        <p>Seleccioná una carrera en el panel del departamento.</p>
      </div>
    );
  }

  if (loading) return <div className="p-4">Cargando informes...</div>;
  if (error) return <div className="p-4 text-danger">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2>Informe Sintético — {carrera.nombre}</h2>

      {/* Formulario de creación */}
      <form onSubmit={handleCrearInforme} className="mb-4">
        <div className="mb-2">
          <label>Título</label>
          <input
            type="text"
            className="form-control"
            value={nuevo.titulo}
            onChange={(e) => setNuevo({ ...nuevo, titulo: e.target.value })}
            required
          />
        </div>
        <div className="mb-2">
          <label>Contenido</label>
          <textarea
            className="form-control"
            rows={3}
            value={nuevo.contenido}
            onChange={(e) => setNuevo({ ...nuevo, contenido: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Crear Informe
        </button>
      </form>

      {/* Tabla de informes existentes */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Título</th>
            <th>Contenido</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {informes.length > 0 ? (
            informes.map((inf) => (
              <tr key={inf.id}>
                <td>{inf.titulo}</td>
                <td>{inf.contenido}</td>
                <td>{inf.fecha}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No hay informes aún</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
