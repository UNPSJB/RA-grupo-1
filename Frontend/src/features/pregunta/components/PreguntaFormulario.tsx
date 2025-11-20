import { useEffect, useState } from "react";
import SelectOpciones from "../components/SelectOpciones";
import OpcionNueva from "../components/OpcionNueva";
import NotificacionExito from "../components/NotificacionExito";
import SelectCategoria from "../components/SelectCategoria";

interface Opcion {
  id: number;
  contenido: string;
}

interface Categoria {
  id: number;
  codigo: string;
  texto: string;
}

export default function PreguntaFormulario() {
  const [oracion, setOracion] = useState("");
  const [opciones, setOpciones] = useState<Opcion[]>([]);
  const [opcionElegida, setOpcionElegida] = useState<number[]>([]);
  const [notificacionExito, setNotificacionExito] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaElegida, setCategoriaElegida] = useState<string>("");


  useEffect(() => {
    fetch("http://127.0.0.1:8000/opciones")
      .then((res) => res.json())
      .then((data) => setOpciones(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error cargando opciones:", err));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/encuestas/1/categorias") //HARCODEADO USAR LA API
      .then((res) => res.json())
      .then((data) => setCategorias(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error cargando categorias:", err));
  }, []);

  const toggleOpcion = (id: number) => {
    if (opcionElegida.includes(id)) {
      setOpcionElegida(opcionElegida.filter((oid) => oid !== id));
    } else {
      setOpcionElegida([...opcionElegida, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !oracion.trim() ||
      opcionElegida.length === 0 ||
      !categoriaElegida
    ) {
      alert(
        "Ingresa una oracion, selecciona una categoría y una opción."
      );
      return;
    }

    fetch("http://127.0.0.1:8000/preguntas/cerrada", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoria_id: Number(categoriaElegida),
        oracion,
        opcion_ids: opcionElegida,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al crear la pregunta");
        return res.json();
      })
      .then(() => {
        setNotificacionExito("Pregunta creada");
        setOracion("");
        setOpcionElegida([]);
        setCategoriaElegida("");
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
     <div className="p-2">
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
            placeholder="Escribi una pregunta"
          />
        </div>

        <SelectCategoria
          categorias={categorias}
          categoriaElegida={categoriaElegida}
          onChange={(id) => setCategoriaElegida(id)}
        />

        <SelectOpciones
          opciones={opciones}
          opcionSeleccionadas={opcionElegida}
          toggleOpcion={toggleOpcion}
        />

        <OpcionNueva
          opcionCreadaOn={(opcion) => {
            setOpciones([...opciones, opcion]);
            setOpcionElegida([...opcionElegida, opcion.id]);
          }}
        />

        <div className="d-flex justify-content-end mt-3">
          <button type="submit" className="btn btn-primary">
            Guardar Pregunta
          </button>
        </div>
      </form>
    </>
  );
}