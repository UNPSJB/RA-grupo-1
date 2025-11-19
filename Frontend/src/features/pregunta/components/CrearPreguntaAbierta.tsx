import { useState, useEffect } from "react";
import NotificacionExito from "../components/NotificacionExito";
import SelectCategoria from "../components/SelectCategoria";

interface Categoria {
  id: number;
  codigo: string;
  texto: string;
}

export default function CrearPreguntaAbierta() {
  const [oracion, setOracion] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaElegida, setCategoriaElegida] = useState<string>("");
  const [notificacionExito, setNotificacionExito] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/encuestas/1/categorias") //DATO HARCODEADO ACA VA LA API
      .then((res) => res.json())
      .then((data) => setCategorias(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error cargando categorias:", err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!oracion.trim() || !categoriaElegida) {
      alert("Ingresa una oracion y elegi una categoría.");
      return;
    }

    fetch("http://127.0.0.1:8000/preguntas/abierta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoria_id: Number(categoriaElegida),
        oracion,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Hubo un problema al crear la pregunta abierta");
        return res.json();
      })
      .then(() => {
        setNotificacionExito("Pregunta abierta creada");
        setOracion("");
        setCategoriaElegida("");
      })
      .catch((err) => console.error("Error:", err));
  };
  return (
    <div className = "container py-4">
      <div className ="card shadow">
        <div className="card-header bg-primary text-white">
            <h1 className="h4 mb-0">Crear Pregunta Abierta</h1>
        </div>
        <div className="card-body">
          {notificacionExito && (
            <NotificacionExito
              notificacion={notificacionExito}
              onClose={() => setNotificacionExito(null)}
            />
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Oración</label>
              <input
                type="text"
                className="form-control"
                value={oracion}
                onChange={(e) => setOracion(e.target.value)}
                placeholder="Escribi la pregunta abierta"
              />
            </div>

            <SelectCategoria
              categorias={categorias}
              categoriaElegida={categoriaElegida}
              onChange={(id) => setCategoriaElegida(id)}
            />

            <div className="d-flex justify-content-end mt-3">
              <button type="submit" className="btn btn-primary">
                Guardar Pregunta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}