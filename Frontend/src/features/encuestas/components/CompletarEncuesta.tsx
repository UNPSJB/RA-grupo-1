import React, { useState } from "react";

interface EncuestaCompletarProps {
  encuestaId: number;
  alumnoId: number;
  onClose: () => void;
}

const EncuestaCompletar: React.FC<EncuestaCompletarProps> = ({
  encuestaId,
  alumnoId,
  onClose,
}) => {
  const [encuesta, setEncuesta] = useState<any>(null);
  const [respuestas, setRespuestas] = useState<{ [key: number]: any }>({});
  const [cargando, setCargando] = useState(true);

  // 🔹 1) Cargar encuesta desde FastAPI
  React.useEffect(() => {
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

    cargarEncuesta();
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

  // 🔹 3) Enviar respuestas al backend
  const enviarRespuestas = async () => {
    const payload = {
      encuesta_id: encuestaId,
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
      onClose();
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
          {/* 🔸 Render Categorías y Preguntas Cerradas */}
          {encuesta.categorias.map((cat: any) => (
            <div key={cat.id} className="categoria">
              <h3>{cat.nombre}</h3>

              {cat.preguntas.map((preg: any) => (
                <div key={preg.id} className="pregunta">
                  <p>{preg.texto}</p>

                  {/* 🔸 Pregunta de opción múltiple */}
                  {preg.opciones.length > 0 &&
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

                  {/* 🔸 Pregunta abierta */}
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
          ))}

          {/* 🔹 Preguntas Abiertas Extra */}
          {encuesta.preguntas_abiertas.length > 0 && (
            <>
              <h3>Preguntas adicionales</h3>
              {encuesta.preguntas_abiertas.map((preg: any) => (
                <div key={preg.id} className="pregunta">
                  <p>{preg.texto}</p>
                  <textarea
                    placeholder="Escribí tu respuesta..."
                    onChange={(e) =>
                      guardarRespuesta(Number(preg.id), null, e.target.value)
                    }
                  />
                </div>
              ))}
            </>
          )}
        </div>

        <footer>
          <button onClick={onClose} className="boton boton-cancelar">
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
