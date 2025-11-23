import { useEffect, useState } from "react";
import { getFormulariosPendientes } from "../services/departamentoServices";

export const FormulariosPendientes = () => {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFormulariosPendientes(1)  // departamento_id = 1
      .then(data => setFormularios(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (formularios.length === 0) return <p>No hay formularios pendientes.</p>;

  return (
    <div>
      <h2>Formularios Pendientes</h2>
      {formularios.map(f => (
        <div className="card my-3 p-3" key={f.id}>
          <h5>{f.titulo}</h5>
          <p><strong>Asignatura:</strong> {f.asignatura}</p>
          <p><strong>Docente:</strong> {f.docente}</p>
          <p><strong>Fecha límite:</strong> {f.fecha_limite}</p>
          <span className="badge bg-warning">Pendiente</span>
        </div>
      ))}
    </div>
  );
};
