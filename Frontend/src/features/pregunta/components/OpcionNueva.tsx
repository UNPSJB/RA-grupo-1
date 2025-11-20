import { useState } from "react";

interface Opcion {
  id: number;
  contenido: string;
}

interface Props {
  opcionCreadaOn: (opcion: Opcion) => void;
}

export default function OpcionNueva({ opcionCreadaOn }: Props) {
  const [opcionNueva, setOpcionNueva] = useState("");

  const handleAgregarOpcion = () => {
    if (!opcionNueva.trim()) return;

    fetch("http://127.0.0.1:8000/opciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contenido: opcionNueva }),
    })
      .then((res) => res.json())
      .then((data: Opcion) => {
        opcionCreadaOn(data);
        setOpcionNueva("");
      })
      .catch((err) => console.error("Error cuando se creaba la opción:", err));
  };

  return (
    <div className="mb-3 d-flex">
      <input
        type="text"
        className="form-control me-2"
        value={opcionNueva}
        onChange={(e) => setOpcionNueva(e.target.value)}
        placeholder="Nueva opción"
      />
      <button type="button" className="btn btn-outline-success" onClick={handleAgregarOpcion}>
        Agregar
      </button>
    </div>
  );
}