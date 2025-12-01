import React, { useState } from 'react';

interface Opcion {
    id: number;
    contenido: string;
}

interface GestorOpcionesProps {
    opcionesCatalogo: Opcion[];
    opcionesSeleccionadas: number[];
    setOpcionesSeleccionadas: React.Dispatch<React.SetStateAction<number[]>>;
    setOpcionesCatalogo: React.Dispatch<React.SetStateAction<Opcion[]>>;
    cargando: boolean;
}

export default function GestorOpciones({
    opcionesCatalogo,
    opcionesSeleccionadas,
    setOpcionesSeleccionadas,
    setOpcionesCatalogo,
    cargando,
}: GestorOpcionesProps) {
    const [nuevaOpcionContenido, setNuevaOpcionContenido] = useState("");

    const toggleOpcion = (id: number) => {
        setOpcionesSeleccionadas(prev => 
          prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
        );
    };

    const handleCrearOpcionNueva = () => {
        if (!nuevaOpcionContenido.trim()) {
            alert("Falta contendio para crear la nueva opción.");
            return;
        }
        
        fetch("http://localhost:8000/opciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contenido: nuevaOpcionContenido }),
        })
          .then((res) => {
              if (!res.ok) throw new Error("Hubo un problema al crear la opción.");
              return res.json();
          })
          .then((data: Opcion) => {
            setOpcionesCatalogo(prev => [...prev, data]);
            setOpcionesSeleccionadas(prev => [...prev, data.id]);
            setNuevaOpcionContenido("");
          })
          .catch((err) => {
              console.error("Error creando opción:", err);
              alert("Error al crear la opción.");
          });
    };

    return (
        <div className="mb-3 border p-3 bg-white rounded">
            <h6 className="fw-bold">Opciones para respuesta cerrada</h6>
            <label className="form-label">Seleccionar Opciones disponibles:</label>
            <div className="list-group mb-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {opcionesCatalogo.map((opcion) => (
                    <label key={opcion.id} className="list-group-item d-flex align-items-center">
                        <input
                            type="checkbox"
                            className="form-check-input me-2"
                            checked={opcionesSeleccionadas.includes(opcion.id)}
                            onChange={() => toggleOpcion(opcion.id)}
                            disabled={cargando}
                        />
                        {opcion.contenido}
                    </label>
                ))}
            </div>
            <label className="form-label">Crear una nueva opción:</label>
            <div className="d-flex">
                <input
                    type="text"
                    className="form-control me-2"
                    value={nuevaOpcionContenido}
                    onChange={(e) => setNuevaOpcionContenido(e.target.value)}
                    placeholder="Contenido de nueva opción"
                    disabled={cargando}
                />
                <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={handleCrearOpcionNueva}
                    disabled={cargando || !nuevaOpcionContenido.trim()}
                >
                    Crear
                </button>
            </div>
            {opcionesSeleccionadas.length > 0 && <p className="mt-2 small text-success">Opciones elegidas: {opcionesSeleccionadas.length}</p>}
        </div>
    );
}