import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EncuestaCompletar: React.FC = () => {
  const { encuestaId } = useParams();  

  const alumnoId = Number(localStorage.getItem("alumno_id") || "1");
  const [encuesta, setEncuesta] = useState<any>(null);
  const [respuestas, setRespuestas] = useState<{ [key: number]: any }>({});
  const [cargando, setCargando] = useState(true);

  // Log de control
  useEffect(() => {
    if (encuesta) {
      console.log(" ENCUESTA COMPLETA:", JSON.stringify(encuesta, null, 2));
    }
  }, [encuesta]);

  // Cargar encuesta
  useEffect(() => {
    const cargarEncuesta = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/encuestas/${encuestaId}/completar`
        );
        const data = await res.json();
        setEncuesta(data);
      } catch (error) {
        console.error("Error al cargar encuesta:", error);
      } finally {
        setCargando(false);
      }
    };

    if (encuestaId) cargarEncuesta();
  }, [encuestaId]);

  // Guardar respuestas en memoria local
  const guardarRespuesta = (
    preguntaId: number,
    opcionId: number | null,
    texto: string | null
  ) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: {
        opcion_id: opcionId,
        texto,
      },
    }));
  };

  // Enviar respuestas al backend
  const enviarRespuestas = async () => {
    const payload = {
      encuesta_id: Number(encuestaId),
      alumno_id: alumnoId,
      respuestas: Object.keys(respuestas).map((pid) => ({
        pregunta_id: Number(pid),
        opcion_id: respuestas[pid].opcion_id || null,
        texto: respuestas[pid].texto || null,
      })),
    };

    try {
      const res = await fetch("http://localhost:8000/encuestas/respuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al enviar encuesta");

      alert("Encuesta enviada exitosamente ");
      window.history.back();
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al enviar la encuesta");
    }
  };

  if (cargando) return <p>Cargando encuesta...</p>;
  if (!encuesta) return <p>Error cargando la encuesta</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>{encuesta.titulo}</h2>

      <p>
        <strong>Asignatura:</strong> {encuesta.asignatura} <br />
        <strong>Docente:</strong> {encuesta.docente} <br />
        <strong>Ciclo lectivo:</strong> {encuesta.ciclo_lectivo}
      </p>

      <hr />

      {encuesta.categorias?.map((cat: any) => (
        <div key={cat.id} style={{ marginBottom: "25px" }}>
          <h3>{cat.texto}</h3>

          {cat.preguntas?.map((preg: any) => (
            <div key={preg.id} style={{ marginBottom: "15px" }}>
              <p><strong>{preg.texto}</strong></p>

              {/* Opciones */}
              {preg.opciones?.length > 0 &&
                preg.opciones.map((op: any) => (
                  <label key={op.id} style={{ display: "block", marginLeft: "15px" }}>
                    <input
                      type="radio"
                      name={`pregunta-${preg.id}`}
                      value={op.id}
                      onChange={() => guardarRespuesta(preg.id, op.id, null)}
                    />
                    {" "}{op.texto}
                  </label>
                ))}

              {/* Pregunta abierta */}
              {preg.tipo === "abierta" && (
                <textarea
                  placeholder="Escribí tu respuesta..."
                  onChange={(e) =>
                    guardarRespuesta(preg.id, null, e.target.value)
                  }
                  style={{ width: "100%", height: "70px", marginTop: "8px" }}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={enviarRespuestas}
        style={{
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Enviar encuesta
      </button>
    </div>
  );
};

export default EncuestaCompletar;
