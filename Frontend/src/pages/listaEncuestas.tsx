// src/pages/ListaEncuestas.tsx
import { useEffect, useState } from "react";

type Encuesta = {
  id: number;
  titulo: string;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
  materia_id: number;
};

export default function ListaEncuestas() {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [respuestas, setRespuestas] = useState<{ [key: number]: string }>({});

  // Traer encuestas del backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/encuestas/")
      .then((res) => res.json())
      .then((data) => setEncuestas(data))
      .catch((err) => console.error("Error al cargar encuestas:", err));
  }, []);

  const opciones = ["Regular", "Medio", "Bueno"];

  const responderEncuesta = async (encuestaId: number, opcion: string) => {
    try {
      // Guardamos localmente para que se tilden los botones
      setRespuestas((prev) => ({ ...prev, [encuestaId]: opcion }));

      // Enviar respuesta al backend
      await fetch("http://127.0.0.1:8000/encuestas/responder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estudiante_id: 1, // ejemplo de estudiante fijo
          encuesta_id: encuestaId,
          respuesta_texto: opcion,
        }),
      });
      console.log("Respuesta enviada:", opcion);
    } catch (err) {
      console.error("Error al enviar respuesta:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Encuestas Disponibles</h1>
      {encuestas.length === 0 && <p>No hay encuestas activas</p>}
      {encuestas.map((encuesta) => (
        <div
          key={encuesta.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
        >
          <h2>{encuesta.titulo}</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            {opciones.map((opcion) => (
              <button
                key={opcion}
                onClick={() => responderEncuesta(encuesta.id, opcion)}
                style={{
                  padding: "5px 10px",
                  backgroundColor:
                    respuestas[encuesta.id] === opcion ? "green" : "#eee",
                  color: respuestas[encuesta.id] === opcion ? "white" : "black",
                  cursor: "pointer",
                }}
                disabled={!!respuestas[encuesta.id]} // deshabilitar si ya respondió
              >
                {opcion}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
