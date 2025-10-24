import type { Asignatura } from "../types/asignaturaTypes";
import { Link } from "react-router-dom";
type Props = {
  asignaturas: Asignatura[] | undefined;
};

export default function ListarAsignaturas({ asignaturas }: Props) {
  if (!asignaturas || asignaturas.length === 0) {
    return (
      <div className="alert alert-info text-center">
        No hay asignaturas habilitadas para este docente
      </div>
    );
  }

  return (
    <div>
      <h2 className="h5 mb-3">Asignaturas asignadas</h2>
      <div className="list-group">
        {asignaturas.map((asignatura, i) => (
          <div key={asignatura.id} className="col-12 mb-3">
            <div className="card">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted me-3">{i + 1}.</span>
                  <span className="fw-bold">{asignatura.nombre}</span>
                  <span className="text-dark"> – {asignatura.matricula}</span>
                </div>
                <Link
                  to={`/detallemateria/${asignatura.id}`}
                  state={{ nombre: asignatura.nombre }}
                  className="btn btn-primary btn-sm"
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}