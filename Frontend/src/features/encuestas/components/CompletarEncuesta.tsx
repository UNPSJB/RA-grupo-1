import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CompletarEncuesta() {
  const { encuestaId } = useParams();
  const alumnoId = localStorage.getItem("alumno_id") || 1;

  const [encuesta, setEncuesta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const cargarEncuesta = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/encuestas/${encuestaId}/completar?alumno_id=${alumnoId}`
      );

      const data = await response.json();
      setEncuesta(data);

    } catch (err) {
      console.error("Error cargando encuesta:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEncuesta();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (!encuesta) return <p>No se encontró la encuesta</p>;

  return (
    <div className="container mt-4">
      <h2>{encuesta.titulo}</h2>
      <h4>{encuesta.asignatura}</h4>
      <p><strong>Docente:</strong> {encuesta.docente}</p>

      <div className="encuesta-header shadow-sm p-4 mb-4 rounded">
  <div className="d-flex justify-content-between align-items-start">
    
    <div>
      <span className="badge bg-primary px-3 py-2 me-2">
        {encuesta.codigo_asignatura || "SIN-CÓDIGO"}
      </span>

      <span className="badge bg-secondary px-3 py-2">
        {encuesta.ciclo_lectivo}
      </span>

      <h2 className="mt-3 fw-bold">{encuesta.asignatura}</h2>
      <p className="text-muted mb-1">
        Año Lectivo {encuesta.ciclo_lectivo} · {encuesta.carrera || "Ingeniería"}
      </p>

      <p className="text-muted">
        <strong>Docente:</strong> {encuesta.docente}
      </p>
    </div>
  </div>
</div>

      {encuesta.categorias.map((cat: any) => (
        <div key={cat.id} className="mb-4 p-3 border rounded">
          <h3>{cat.codigo} - {cat.nombre}</h3>

          {cat.preguntas.map((preg: any) => (
            <div key={preg.id} className="mb-3">
              <p>{preg.texto}</p>

              {preg.tipo === "abierta" ? (
                <textarea className="form-control" rows={3} />
              ) : (
                preg.opciones.map((op: any) => (
                  <div key={op.id}>
                    <input
                      type="radio"
                      name={`preg-${preg.id}`}
                      value={op.id}
                    />
                    <label className="ms-2">{op.texto}</label>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
