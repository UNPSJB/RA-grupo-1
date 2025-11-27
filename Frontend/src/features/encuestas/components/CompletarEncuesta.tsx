import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EncuestaCompletar: React.FC = () => {
  const { encuestaId } = useParams();   // <-- 🔥 ESTA ES LA CLAVE

  const alumnoId = Number(localStorage.getItem("alumnoId")); // o de donde lo guardes

  const [encuesta, setEncuesta] = useState<any>(null);
  const [respuestas, setRespuestas] = useState<{ [key: number]: any }>({});
  const [cargando, setCargando] = useState(true);
  
    useEffect(() => {
      if (encuesta) {
        console.log(
          " ENCUESTA COMPLETA:",
          JSON.stringify(encuesta, null, 2)
        );
      }
    }, [encuesta]);
  // 🔹 Cargar encuesta desde FastAPI
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

  // 🔹 Enviar respuestas
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

      alert("Encuesta enviada exitosamente 🎉");
      window.history.back();
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al enviar la encuesta");
    }
  };

  if (cargando) return <p>Cargando encuesta...</p>;
  if (!encuesta) return <p>Error cargando la encuesta</p>;

  return (
    <div className="modal">
      <div className="modal-contenido">
        <header>
          <h2>{encuesta.titulo}</h2>
          <p>
            <strong>Asignatura:</strong> {encuesta.asignatura}
            <br />
            <strong>Docente:</strong> {encuesta.docente}
            <br />
            <strong>Ciclo lectivo:</strong> {encuesta.ciclo_lectivo}
          </p>
        </header>

          <div className="cuerpo-modal">
            {!encuesta ? (
              <p>Cargando encuesta...</p>
            ) : !encuesta.categorias ? (
              <p>No hay categorías disponibles.</p>
            ) : (
              encuesta.categorias.map((cat: any) => (
                <div key={cat.id} className="categoria">
                  <h3>{cat.texto}</h3>

                  {cat.preguntas?.map((preg: any) => (
                    <div key={preg.id} className="pregunta">
                      <p>{preg.texto}</p>

                      {preg.opciones?.length > 0 &&
                        preg.opciones.map((op: any) => (
                          <label key={op.id} className="opcion">
                            <input
                              type="radio"
                              name={`pregunta-${preg.id}`}
                              value={op.id}
                              onChange={() =>
                                guardarRespuesta(preg.id, op.id, null)
                              }
                            />
                            {op.texto}
                          </label>
                        ))}

                      {preg.tipo === "abierta" && (
                        <textarea
                          placeholder="Escribí tu respuesta..."
                          onChange={(e) =>
                            guardarRespuesta(preg.id, null, e.target.value)
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>


        <footer>
          <button onClick={() => window.history.back()} className="boton boton-cancelar">
            Cancelar
          </button>

          <button onClick={enviarRespuestas} className="boton">
            Enviar encuesta
          </button>
        </footer>
      </div>
    </div>
  );
};

export default EncuestaCompletar;
